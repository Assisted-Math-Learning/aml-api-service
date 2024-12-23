export enum Status {
  DRAFT = 'draft',
  LIVE = 'live',
}

export enum ProcessStatus {
  OPEN = 'open',
  PROGRESS = 'progress',
  FAILED = 'failed',
  ERROR = 'errored',
  COMPLETED = 'completed',
  REOPEN = 'reopen',
  VALIDATED = 'validated',
}

export enum QuestionStatus {
  NOOP = 'noop',
  REVISITED = 'revisited',
}
