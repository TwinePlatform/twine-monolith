export type ButtonType = 'archive' | 'delete' | 'restore' | 'save';


export type ArchiveButtonConfig = {
  buttonType: 'archive';
  onArchive: () => void;
  onEdit: () => void;
}

export type DeleteButtonConfig = {
  buttonType: 'delete';
  onDelete: () => void;
  onEdit: () => void;
}

export type RestoreButtonConfig = {
  buttonType: 'restore';
  onRestore: () => void;
}

export type SaveButtonConfig = {
  buttonType: 'save';
  onSave: () => void;
}

export type ButtonConfig =
  ArchiveButtonConfig
  | DeleteButtonConfig
  | RestoreButtonConfig
  | SaveButtonConfig
