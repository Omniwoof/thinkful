export interface Poll {
  pollType:string = ""
  title:string = "";
  buttonName:string = "";
  slider: Slider[];

export interface Slider {
    maxSlider:string = "";
    label1:string;
    label2:string;
}

  constuctor(){
  }
}
