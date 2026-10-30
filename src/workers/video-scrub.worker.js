import MP4Box from 'mp4box';
let paused = false;
let started = false;
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const send = (message) => self.postMessage(message);
function demux(buffer) {
  return new Promise((resolve, reject) => {
    const file = MP4Box.createFile();
    const samples = [];
    let info = null;
    let description;
    file.onError = (error) => reject(new Error(String(error)));
    file.onReady = (metadata) => {
      info = metadata;
      const track = metadata.videoTracks[0];
      if (!track) {
        reject(new Error('No video track'));
        return;
      }
      for (const entry of file.getTrackById(track.id).mdia.minf.stbl.stsd.entries) {
        const box = entry.avcC || entry.hvcC || entry.vpcC || entry.av1C;
        if (box) {
          const stream = new MP4Box.DataStream(undefined, 0, MP4Box.DataStream.BIG_ENDIAN);
          box.write(stream);
          description = new Uint8Array(stream.buffer, 8);
          break;
        }
      }
      file.setExtractionOptions(track.id, null, { nbSamples: Infinity });
      file.start();
    };
    file.onSamples = (_id, _user, extracted) => samples.push(...extracted);
    const data = buffer;
    data.fileStart = 0;
    file.appendBuffer(data);
    file.flush();
    setTimeout(
      () => (info ? resolve({ info, samples, description }) : reject(new Error('MP4 parse failed'))),
      0,
    );
  });
}
async function decode(source, maxWidth, fps, quality) {
  if (typeof VideoDecoder === 'undefined' || typeof OffscreenCanvas === 'undefined')
    throw new Error('Worker decoding unavailable');
  const response = await fetch(source, { mode: 'cors' });
  if (!response.ok) throw new Error('Video fetch failed');
  const { info, samples, description } = await demux(await response.arrayBuffer());
  const track = info.videoTracks[0];
  const config = {
    codec: track.codec,
    codedWidth: track.video.width,
    codedHeight: track.video.height,
    description,
    hardwareAcceleration: 'no-preference',
  };
  if (!(await VideoDecoder.isConfigSupported(config)).supported)
    config.hardwareAcceleration = 'prefer-software';
  if (!(await VideoDecoder.isConfigSupported(config)).supported) throw new Error('Unsupported codec');
  const width = Math.min(maxWidth, track.video.width);
  const canvas = new OffscreenCanvas(width, Math.round((width * track.video.height) / track.video.width));
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas unavailable');
  send({ type: 'metadata', duration: info.duration / info.timescale });
  let pending = 0;
  let failure = null;
  let queue = Promise.resolve();
  let lastTimestamp = -Infinity;
  const frameGap = 1e6 / Math.min(fps, 180 / (info.duration / info.timescale));
  const decoder = new VideoDecoder({
    output: (frame) => {
      if (frame.timestamp - lastTimestamp < frameGap - 1000) {
        frame.close();
        return;
      }
      lastTimestamp = frame.timestamp;
      pending += 1;
      queue = queue.then(async () => {
        try {
          if (failure) return;
          context.drawImage(frame, 0, 0, canvas.width, canvas.height);
          const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality });
          send({ type: 'frame', timestamp: frame.timestamp, blob });
        } catch (error) {
          failure = error;
        } finally {
          frame.close();
          pending -= 1;
        }
      });
    },
    error: (error) => {
      failure = error;
    },
  });
  decoder.configure(config);
  try {
    for (const sample of samples) {
      while (paused || decoder.decodeQueueSize + pending >= 6) {
        if (failure) throw failure;
        await wait(paused ? 80 : 4);
      }
      if (failure) throw failure;
      decoder.decode(
        new EncodedVideoChunk({
          type: sample.is_sync ? 'key' : 'delta',
          timestamp: (sample.cts * 1e6) / sample.timescale,
          duration: (sample.duration * 1e6) / sample.timescale,
          data: sample.data,
        }),
      );
    }
    await decoder.flush();
    await queue;
    if (failure) throw failure;
    send({ type: 'complete' });
  } finally {
    if (decoder.state !== 'closed') decoder.close();
    await queue;
  }
}
self.onmessage = (event) => {
  if (event.data.type === 'visibility') {
    paused = Boolean(event.data.paused);
    return;
  }
  if (event.data.type !== 'build' || started || !event.data.source) return;
  started = true;
  decode(
    event.data.source,
    event.data.maxWidth ?? 1440,
    event.data.fps ?? 15,
    event.data.quality ?? 0.76,
  ).catch(() => send({ type: 'error' }));
};
