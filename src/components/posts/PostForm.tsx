import {
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
  type FormEvent,
  type ChangeEvent,
} from 'react';
import type { NewPost, Post, UpdatePost } from '@/types/post';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import '../../assets/styles/postform.css';

interface UserOption {
  id: number;
  name: string;
}

interface BaseProps {
  initial?: Partial<Post>;
  userOptions: UserOption[];
  onCancel?: () => void;
}

interface CreateProps extends BaseProps {
  mode: 'create';
  onSubmit: (payload: NewPost) => void | Promise<void>;
}

interface UpdateProps extends BaseProps {
  mode: 'update';
  onSubmit: (payload: UpdatePost) => void | Promise<void>;
}

export type PostFormProps = CreateProps | UpdateProps;

const FORM_CONFIG = {
  textareaRows: 6,
  defaultUserId: 1,
};

const FORM_CONTENT = {
  create: {
    title: 'Create New Post',
    subtitle: 'Share your thoughts with the world',
    submitText: 'Create Post',
    submitIcon: '🚀',
  },
  update: {
    title: 'Edit Post',
    subtitle: 'Update your post content',
    submitText: 'Update Post',
    submitIcon: '💾',
  },
};

const FIELD_ICONS = {
  author: '👤',
  title: '📄',
  content: '📝',
};

function ChevronDownIcon(): ReactNode {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/**
 * PostForm
 * - Yeni post oluşturma veya mevcut postu düzenleme
 * - User seçimi, başlık ve içerik alanlarını içerir
 * - Validasyon + loading state yönetimi
 */
export function PostForm({
  initial,
  mode,
  userOptions,
  onSubmit,
  onCancel,
}: PostFormProps): ReactNode {
  // Form state'leri
  const [userId, setUserId] = useState<number>(
    () => initial?.userId ?? userOptions[0]?.id ?? FORM_CONFIG.defaultUserId
  );
  const [title, setTitle] = useState<string>(() => initial?.title ?? '');
  const [body, setBody] = useState<string>(() => initial?.body ?? '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // initial değişirse formu resetle
  useEffect(() => {
    setUserId(initial?.userId ?? userOptions[0]?.id ?? FORM_CONFIG.defaultUserId);
    setTitle(initial?.title ?? '');
    setBody(initial?.body ?? '');
  }, [initial, userOptions, mode]);

  const formContent = useMemo(() => FORM_CONTENT[mode], [mode]);

  // Form geçerli mi kontrolü
  const isFormValid = useMemo(() => {
    const titleValid = title.trim().length > 0;
    const bodyValid = body.trim().length > 0;
    return titleValid && bodyValid;
  }, [title, body]);

  // Event handler’lar
  const handleUserChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setUserId(Number(e.currentTarget.value));
  }, []);

  const handleTitleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  }, []);

  const handleBodyChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.currentTarget.value);
  }, []);

  const handleCancel = useCallback(() => {
    setUserId(userOptions[0]?.id ?? FORM_CONFIG.defaultUserId);
    setTitle('');
    setBody('');
    onCancel?.();
  }, [onCancel, userOptions]);

  // Submit işlemi
  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (isSubmitting || !isFormValid) {
        return;
      }

      setIsSubmitting(true);

      const payload = { userId, title, body };

      Promise.resolve(onSubmit(payload))
        .then(() => {})
        .catch((error) => {
          console.error('Form submission error:', error);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    },
    [isSubmitting, onSubmit, userId, title, body, isFormValid]
  );

  return (
    <div className="post-form" data-loading={isSubmitting}>
      <div className="post-form__header">
        <h2 className="post-form__title">{formContent.title}</h2>
        <p className="post-form__subtitle">{formContent.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="post-form__form" noValidate>
        {/* User seçimi */}
        <div className="form-field">
          <label htmlFor="user-select" className="form-field__label">
            <div className="form-field__label-text">Full Name</div>
            <div className="form-field__label-icon" aria-hidden="true">
              {FIELD_ICONS.author}
            </div>
          </label>
          <div className="select-wrapper">
            <select
              id="user-select"
              className="select-field"
              value={userId}
              onChange={handleUserChange}
              disabled={isSubmitting}
              required
              aria-describedby="user-select-hint"
            >
              {userOptions.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} (#{user.id})
                </option>
              ))}
            </select>
            <div className="select-icon">
              <ChevronDownIcon />
            </div>
          </div>
          <div id="user-select-hint" className="form-field__hint">
            Select the author for this post
          </div>
        </div>

        {/* Title input */}
        <div className="form-field">
          <label htmlFor="title-input" className="form-field__label">
            <div className="form-field__label-text">Post Title</div>
            <div className="form-field__label-icon" aria-hidden="true">
              {FIELD_ICONS.title}
            </div>
          </label>
          <Input
            id="title-input"
            label=""
            value={title}
            onChange={handleTitleChange}
            variant="default"
            inputSize="lg"
            effect="wave"
            placeholder="Enter your post title..."
            disabled={isSubmitting}
            required
            aria-describedby="title-hint"
          />
          <div id="title-hint" className="form-field__hint">
            Choose a descriptive title for your post
          </div>
        </div>

        {/* Body textarea */}
        <div className="form-field">
          <label htmlFor="body-textarea" className="form-field__label">
            <div className="form-field__label-text">Content</div>
            <div className="form-field__label-icon" aria-hidden="true">
              {FIELD_ICONS.content}
            </div>
          </label>
          <div className="textarea-wrapper">
            <textarea
              id="body-textarea"
              className="textarea-field"
              placeholder="Write your post content here..."
              value={body}
              onChange={handleBodyChange}
              rows={FORM_CONFIG.textareaRows}
              disabled={isSubmitting}
              required
              aria-describedby="body-hint"
              minLength={10}
              maxLength={5000}
            />
            <div className="textarea-effects">
              <div className="textarea-glow" />
              <div className="textarea-wave" />
            </div>
          </div>
          <div id="body-hint" className="form-field__hint">
            Share your thoughts, ideas, or stories (10-5000 characters)
          </div>
        </div>

        {/* Form action butonları */}
        <div className="post-form__actions">
          <Button
            type="submit"
            variant="gradient"
            size="lg"
            effect="glow"
            className="action-button action-button--primary"
            disabled={!isFormValid || isSubmitting}
            loading={isSubmitting}
            loadingText="Saving..."
            aria-describedby="submit-hint"
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

        <div id="submit-hint" className="sr-only">
          {isFormValid ? 'Form is ready to submit' : 'Please fill in all required fields'}
        </div>
      </form>
    </div>
  );
}
