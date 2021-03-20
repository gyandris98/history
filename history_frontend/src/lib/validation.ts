import { FieldError } from 'react-hook-form';

interface IFormatErrorInput {
  error: FieldError;
  field: string;
}

const emailErrors = {
  email: {
    required: 'Az email cím kötelező',
    pattern: 'Nem megfelelő formátumú email cím',
  },
};

const passwordErrors = {
  password: {
    required: 'A jelszó kötelező',
    minLength: 'A jelszó túl rövid',
    maxLength: 'A jelszó túl hosszú',
  },
};

const nameErrors = {
  name: {
    required: 'A név kötelező',
    minLength: 'A név túl rövid',
    maxLength: 'A név túl hosszú',
  },
};

export function formatError(page: string) {
  let result = {};
  switch (page) {
    case 'login':
      result = { ...emailErrors, ...passwordErrors };
      break;
    case 'register':
      result = { ...nameErrors, ...emailErrors, ...passwordErrors };
      break;
    case 'profile':
      result = { ...nameErrors, ...emailErrors };
      break;
    case 'password':
      result = {
        newPassword: { ...passwordErrors.password },
        again: { ...passwordErrors.password },
      };
      break;
  }
  return ({ error, field }: IFormatErrorInput) => {
    if (!error) return;

    console.log(field, error.type, result);
    return result[field][error.type];
  };
}
