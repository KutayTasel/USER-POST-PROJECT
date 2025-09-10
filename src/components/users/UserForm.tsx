import type { JSX, FormEvent, ChangeEvent } from 'react';
import { useEffect, useMemo, useState, useCallback } from 'react';
import type { NewUser, UpdateUser, User } from '@/types/user';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import '../../assets/styles/userform.css';

interface Base {
  initial?: Partial<User>;
  onCancel?: () => void;
}
interface CreateProps extends Base {
  mode: 'create';
  onSubmit: (payload: NewUser) => void | Promise<void>;
}
interface UpdateProps extends Base {
  mode: 'update';
  onSubmit: (payload: UpdateUser) => void | Promise<void>;
}
export type UserFormProps = CreateProps | UpdateProps;

type FormConfig = Readonly<{
  nameMin: number;
  usernameMin: number;
  emailMax: number;
}>;
const FORM_CONFIG: FormConfig = {
  nameMin: 3,
  usernameMin: 3,
  emailMax: 254,
};

type SingleContent = Readonly<{
  title: string;
  subtitle: string;
  submitText: string;
  submitIcon: string;
}>;
type FormContent = Readonly<{
  create: SingleContent;
  update: SingleContent;
}>;
const FORM_CONTENT: FormContent = {
  create: {
    title: 'Create New User',
    subtitle: 'Add a new team member to the platform',
    submitText: 'Create User',
    submitIcon: '👤',
  },
  update: {
    title: 'Edit User',
    subtitle: 'Update user information',
    submitText: 'Update User',
    submitIcon: '💾',
  },
};

// Label ikonları
function UserIcon(): JSX.Element {
  return (
    <div className="form-field__label-icon" aria-hidden="true">
      👤
    </div>
  );
}
function UsernameIcon(): JSX.Element {
  return (
    <div className="form-field__label-icon" aria-hidden="true">
      🏷️
    </div>
  );
}
function MailIcon(): JSX.Element {
  return (
    <div className="form-field__label-icon" aria-hidden="true">
      ✉️
    </div>
  );
}

/**
 * UserForm
 * - Kullanıcı oluşturma ve güncelleme için ortak form
 * - Validasyon, submit ve cancel desteği
 */
export function UserForm({ initial, mode, onSubmit, onCancel }: UserFormProps): JSX.Element {
  // Form state
  const [name, setName] = useState<string>(() => initial?.name ?? '');
  const [username, setUsername] = useState<string>(() => initial?.username ?? '');
  const [email, setEmail] = useState<string>(() => initial?.email ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Başlangıç değerlerini güncelle
  useEffect(() => {
    setName(initial?.name ?? '');
    setUsername(initial?.username ?? '');
    setEmail(initial?.email ?? '');
  }, [initial, mode]);

  const formContent = useMemo(() => FORM_CONTENT[mode], [mode]);

  // Validasyon kuralları
  const isFormValid = useMemo(() => {
    const n = name.trim();
    const u = username.trim();
    const e = email.trim();
    const nameOk = n.length >= FORM_CONFIG.nameMin;
    const userOk = /^[A-Za-z0-9_]+$/.test(u) && u.length >= FORM_CONFIG.usernameMin;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= FORM_CONFIG.emailMax;
    return nameOk && userOk && emailOk;
  }, [name, username, email]);

  // Handlerlar
  const handleName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  }, []);
  const handleUsername = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.currentTarget.value);
  }, []);
  const handleEmail = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
  }, []);
  const handleCancel = useCallback(() => {
    setName('');
    setUsername('');
    setEmail('');
    onCancel?.();
  }, [onCancel]);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (isSubmitting || !isFormValid) return;

      setIsSubmitting(true);

      if (mode === 'create') {
        const payload: NewUser = {
          name: name.trim(),
          username: username.trim(),
          email: email.trim(),
        };
        void Promise.resolve(onSubmit(payload))
          .catch(() => {})
          .finally(() => {
            setIsSubmitting(false);
          });
      } else {
        const payload: UpdateUser = {
          name: name.trim(),
          username: username.trim(),
          email: email.trim(),
        };
        void Promise.resolve(onSubmit(payload))
          .catch(() => {})
          .finally(() => {
            setIsSubmitting(false);
          });
      }
    },
    [isSubmitting, isFormValid, mode, onSubmit, name, username, email]
  );

  return (
    <div className="user-form" data-loading={isSubmitting}>
      <div className="user-form__header">
        <h2 className="user-form__title">{formContent.title}</h2>
        <p className="user-form__subtitle">{formContent.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="user-form__form" noValidate>
        {/* İsim alanı */}
        <label className="form-field">
          <div className="form-field__label">
            <div className="form-field__label-text">Full Name</div>
            <UserIcon />
          </div>
          <Input
            label=""
            value={name}
            onChange={handleName}
            variant="default"
            inputSize="lg"
            effect="wave"
            placeholder="Enter full name..."
            required
            minLength={FORM_CONFIG.nameMin}
            hint={`At least ${FORM_CONFIG.nameMin} characters`}
            disabled={isSubmitting}
          />
        </label>
        {/* Kullanıcı adı alanı */}
        <label className="form-field">
          <div className="form-field__label">
            <div className="form-field__label-text">Username</div>
            <UsernameIcon />
          </div>
          <Input
            label=""
            value={username}
            onChange={handleUsername}
            variant="default"
            inputSize="lg"
            effect="wave"
            placeholder="Enter unique username..."
            required
            minLength={FORM_CONFIG.usernameMin}
            pattern="^[A-Za-z0-9_]+$"
            hint="Only letters, numbers, and underscore"
            disabled={isSubmitting}
          />
        </label>
        {/* Email alanı */}
        <label className="form-field">
          <div className="form-field__label">
            <div className="form-field__label-text">Email Address</div>
            <MailIcon />
          </div>
          <Input
            label=""
            type="email"
            value={email}
            onChange={handleEmail}
            variant="default"
            inputSize="lg"
            effect="wave"
            placeholder="Enter email address..."
            required
            maxLength={FORM_CONFIG.emailMax}
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
            hint="Used for notifications and recovery"
            disabled={isSubmitting}
          />
        </label>

        {/* Aksiyonlar */}
        <div className="user-form__actions">
          <Button
            type="submit"
            variant="gradient"
            size="lg"
            effect="glow"
            className="action-button action-button--primary"
            disabled={!isFormValid || isSubmitting}
            loading={isSubmitting}
            loadingText="Saving..."
            aria-describedby="user-submit-hint"
          >
            <div className="action-button__icon" aria-hidden="true">
              {formContent.submitIcon}
            </div>
            {formContent.submitText}
          </Button>

          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              size="lg"
              effect="magnetic"
              onClick={handleCancel}
              className="action-button action-button--secondary"
              disabled={isSubmitting}
              aria-label="Cancel and close form"
            >
              <div className="action-button__icon" aria-hidden="true">
                ❌
              </div>
              Cancel
            </Button>
          )}
        </div>

        <div id="user-submit-hint" className="sr-only">
          {isFormValid ? 'Form is ready to submit' : 'Please fill in all required fields'}
        </div>
      </form>
    </div>
  );
}
