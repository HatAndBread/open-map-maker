declare module 'undo-manager';

interface UndoManager {
  add: ({
    undo: Function,
    redo: Function
  }) => void
  undo: () => void
  redo: () => void
  hasUndo: () => boolean
  hasRedo: () => boolean
  setCallback: (cb: Function) => void
}
