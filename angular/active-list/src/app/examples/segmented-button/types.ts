export type SegmentedButtonItem = {
  onClick(event: MouseEvent): void;
  label: string;
  active?: boolean;
};
