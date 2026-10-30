export const FORM_CONTROL =
  'block w-full rounded-[5px] border border-[#d9dcd9] bg-white px-[14px] py-3 text-navy leading-[1.5] transition-[border-color,box-shadow] duration-200 hover:border-[#9da7aa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy focus-visible:outline-offset-[3px] aria-invalid:border-[#ad2f27]';
export function FormField({ name, label, required, optional, error, children }) {
  return (
    <div className="contact-field min-w-0">
      <label htmlFor={`contact-${name}`} className="mb-[10px] block text-[12px] font-bold leading-[1.5]">
        {label}{' '}
        {required && (
          <span aria-hidden="true" className="text-[#bd4323]">
            *
          </span>
        )}
        {optional && (
          <span className="contact-optional text-[10px] font-normal text-[#626e77]">(optional)</span>
        )}
      </label>
      {children}
      {error && (
        <p id={`error-${name}`} className="contact-field-error mt-[7px] text-xs leading-[1.6] text-[#a82c24]">
          {error}
        </p>
      )}
    </div>
  );
}
export function InputField({ name, value, onChange, autoComplete, type = 'text', ...field }) {
  return (
    <FormField name={name} {...field}>
      <input
        id={`contact-${name}`}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={field.required}
        maxLength={type === 'email' ? 254 : 120}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(field.error)}
        aria-describedby={field.error ? `error-${name}` : undefined}
        className={`${FORM_CONTROL} min-h-[49px] text-base`}
      />
    </FormField>
  );
}
