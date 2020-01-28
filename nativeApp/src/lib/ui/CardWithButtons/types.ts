export type ButtonType = 'archive' | 'delete' | 'restore' | 'save' | 'empty';


export type ArchiveButtonConfig = {
  buttonType: 'archive';
  onPress: () => void;
  onEdit: () => void;
}

export type DeleteButtonConfig = {
  buttonType: 'delete';
  onDelete: () => void;
  onEdit: () => void;
}

export type RestoreButtonConfig = {
  buttonType: 'restore';
  onPress: () => void;
}

export type SaveButtonConfig = {
  buttonType: 'save';
  onSave: () => void;
}

export type EmptyButtonConfig = {
  buttonType: 'empty';
}

export type ButtonConfig =
  ArchiveButtonConfig
  | DeleteButtonConfig
  | RestoreButtonConfig
  | SaveButtonConfig
  | EmptyButtonConfig
