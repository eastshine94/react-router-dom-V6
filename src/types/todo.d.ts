export interface TodoGetPayload {
  id: number;
  title: string;
  createdAt: string;
}

export type TodosGetPayloadItem = TodoGetPayload;

export type TodosGetPayload = TodosGetPayloadItem[];

export interface TodoSubmitData {
  id: number;
  title: string;
  isSuccess: boolean;
  createdAt: string;
  finishedAt: string;
}

export interface TodosFinishedGetPaylodItem {
  id: number;
  title: string;
  isSuccess: boolean;
  createdAt: string;
  finishedAt: string;
}

export type TodosFinishedGetPaylod = TodosFinishedGetPaylodItem[];
