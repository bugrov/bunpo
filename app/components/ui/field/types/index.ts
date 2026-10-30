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
