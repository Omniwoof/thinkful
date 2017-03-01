export interface Poll {
  title: string;
  clientID: string;
  button: string;
  slider: {
    max: number;
    label1: string;
    label2:string;
  }
  multi: {
    test: string;
  }
}
