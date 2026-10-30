export interface UiButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export interface UiInputProps {
  type?: 'text' | 'email' | 'password' | 'search' | 'number' | 'tel' | 'url';
  invalid?: boolean;
}

export interface UiFieldProps {
  label: string;
  hint?: string;
  error?: string;
}

export interface UiFieldSlotProps {
  id: string;
  describedBy: string | undefined;
  invalid: boolean;
}

export interface UiFieldSlots {
  default(props: UiFieldSlotProps): unknown;
}

export interface UiBadgeProps {
  variant?: 'neutral' | 'accent' | 'success' | 'danger';
}
