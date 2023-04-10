export interface Action {
  name: string;
  //   params: string[];
}

export interface Trigger {
  name: string;
  //   params: string[];
}

export interface Target {}

export interface Block {
  rawText: string;
  triggers: Trigger[];
  actions: Action[];
  targets: Target[];
}
