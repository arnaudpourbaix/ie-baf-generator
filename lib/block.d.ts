export interface Action {
    name: string;
}
export interface Trigger {
    name: string;
}
export interface Target {
}
export interface Block {
    rawText: string;
    triggers: Trigger[];
    actions: Action[];
    targets: Target[];
}
