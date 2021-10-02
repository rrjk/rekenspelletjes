/* eslint-disable class-methods-use-this */
/* eslint max-classes-per-file: ["error", 5] */
import { LitElement, html, css, svg, SVGTemplateResult, TemplateResult} from 'lit';

/** Helper class to help to translate from position in number line coordinates and viewport coordinates 
*/
class NumberLinePositionTranslator {
  /** The maximum value for the number line, should be a multiple of 10.  */
  minimum: number;
  /** The maximum value for the number line, should be a multiple of 10.  */
  maximum: number;
  /**  The margin left and right of the number line in viewport units. s*/
  margin: number;
  /** Y position in viewport units of the line of the Numberline */
  yPosLine: number;

  /** Construct a new translotor object.
   * @param minimum - The minimum value for the number line, should be a multiple of 10.
   * @param maximum - The maximum value for the number line, should be a multiple of 10.
   * @param margin - The margin left and right of the number line in viewport units. s
   * @param yPosLine - Y position in viewport units of the line of the Numberline
   */
  constructor(minimum: number, maximum: number, margin: number, yPosLine: number){
    this.minimum = minimum;
    this.maximum = maximum;
    this.margin = margin;
    this.yPosLine = yPosLine
  }

  /** Convert a number into a position 
   * @param position - position in numberline units to convert into position in viewport units, has to be between the lowest and the highest number set in the properties.
   * @return - position in viewport units.
   * 
  */
  translatePosition(position: number): number{
      // We divide the 1000 pixels by the the range between highest and lowest number to get the number of pixels per unit
      return 1000/(this.maximum-this.minimum)*(position-this.minimum) + this.margin;
  }  

  /** Convert a distance into a distance in viewport coordinates 
   * @param distance - distance in numberLine units to convert into viewport units
   * @return - distance in viewport units
  */
  numberDistanceToViewportDistance(distance: number): number{
    // We divide the 1000 pixels by the the range between highest and lowest number to get the number of pixels per unit
    return 1000/(this.maximum-this.minimum)*distance;
  }
}

export type PhotoIds = "Jan"|"Anne"|"Johannes"|"Frank"
interface PhotoMetaData{id: PhotoIds, fileName: string, width: number, height: number}


export class NumberLineHangingPhoto {    
  static photos= {Anne: {fileName: "Mompitz Anne.png", width: 434, height: 449},
                  Jan: {fileName: "Mompitz Jan.png", width: 1183, height: 1133},
                  Johannes: {fileName: "Mompitz Johannes.png", width: 469, height: 556},
                  Frank: {fileName: "Mompitz Frank.png", width: 584, height: 579},
                };

  translator: NumberLinePositionTranslator;
  position: number;
  distance: number;
  viewBoxWidth: number;
  photoId: PhotoIds

  /** Construct a hanging photo 
   * @param translator - Translator to use to translate between number line and viewport coordinates.
   * @param position - Position at which to place the photo in number line units.
   * @param distance - Distance between the photo and the number line, in viewport units.
  */
  constructor (translator: NumberLinePositionTranslator, position:number=50, distance:number=10, photoId: PhotoIds="Frank"){
    this.translator = translator;
    this.position = position;
    this.distance = distance
    this.photoId = photoId
  }

  /** Render a line connecting a photoframe and the number line
   */
  renderLineForPhoto(): SVGTemplateResult{
    console.log('renderLineForPhoto');
    console.log(this.translator.translatePosition(this.position));
    return svg`
      <line
        x1 = "${this.translator.translatePosition(this.position)}"
        x2 = "${this.translator.translatePosition(this.position)}"
        y1 = "${this.translator.yPosLine}"
        y2 = "${this.translator.yPosLine+this.distance}"
        style="stroke: red; stroke-width: 1"
      />`;
  }

  get photoInfo(){
    return NumberLineHangingPhoto.photos[this.photoId]
  }

  /** Render the photoframe
   * @return Template for the photoframe, including attaching line.
   */
  render(): SVGTemplateResult{
    let width = 0;
    let height = 0;
    if (this.photoInfo.width <= this.photoInfo.height){
      width = this.photoInfo.width/this.photoInfo.height*70;
      height = 70;
    }
    else{
      width = 70;
      height = this.photoInfo.height/this.photoInfo.width*70;
    }
    let positionFrame = this.translator.translatePosition(this.position)-(width/2);
    if (positionFrame < 1){
      positionFrame = 1;
    }
    if (positionFrame > this.viewBoxWidth -1 - width){
      positionFrame = this.viewBoxWidth -1 - width;
    }
    return svg`
      ${this.renderLineForPhoto()}
      <g onclick="alert('You have clicked the photo on position ${this.position}')">
        <rect
            x = "${positionFrame}"
            y = "${this.distance+this.translator.yPosLine}"
            width = "${width*1.10}"
            height = "${height*1.10}"
            fill = "none"
            style="stroke: red; stroke-width: 2"
        />
        <image
            alt = "Anne"
            x = "${positionFrame+0.05*width}"
            y = "${this.distance+this.translator.yPosLine+0.05*width}"
            width = "${width}"
            height = "${height}"
            href = "images/${this.photoInfo.fileName}"
        />
      </g>
    `;
  }

}

export class GetallenLijn extends LitElement {

  show1TickMarks: boolean;
  show5TickMarks: boolean;
  show10TickMarks: boolean;
  minimum: number;
  maximum: number;
  photoPositions: number[];
  
  margin: number;



  translator: NumberLinePositionTranslator;
  photos: NumberLineHangingPhoto[];

  static get properties() {
    return {
      show10TickMarks: { type: Boolean },
      show5TickMarks: {type: Boolean},
      show1TickMarks: {type: Boolean},
      minimum: {type: Number},
      maximum: {type: Number},
      photoPositions: {type: Array}
    };
  }

  static get styles() {
    return css``;
  }

  /** @constructor */
  constructor() {
    super();
    this.show1TickMarks = false;
    this.show5TickMarks = false;
    this.show10TickMarks = true;
    this.minimum = 0;
    this.maximum = 100;
    this.photoPositions = [3, 6, 43, 89];

    this.margin = 15;
    this.translator = new NumberLinePositionTranslator(this.minimum, this.maximum, this.margin, 8);
    this.photos = [new NumberLineHangingPhoto(this.translator, this.photoPositions[0], 25, "Anne"), 
                   new NumberLineHangingPhoto(this.translator, this.photoPositions[1], 105, "Johannes"),
                   new NumberLineHangingPhoto(this.translator, this.photoPositions[2], 25, "Frank"),
                   new NumberLineHangingPhoto(this.translator, this.photoPositions[3], 105, "Jan"),
                  ];
  }

  get viewBoxWidth(){
    return 1000 + 2*this.margin;
  }

  updatePhotos(){
    console.log("updatePhotos");
    this.photoPositions.sort( (a,b) => a-b);
    this.photoPositions.map( (position, index) => this.photos[index].position = position);
  }

  willUpdate(changedProperties: Map<string, any>){
    console.log(`willUpdate: ${changedProperties}`);
    if (changedProperties.has('minimum')){
      this.translator.minimum = this.minimum;
    }
    if (changedProperties.has('maximum')){
      this.translator.maximum = this.maximum;
    }
    if (changedProperties.has('photoPositions')){
      this.updatePhotos();
    }
  }

  connectedCallback(): void{
    super.connectedCallback();
    this.translator.minimum = this.minimum;
    this.translator.maximum = this.maximum;
    this.updatePhotos();
  }

  /** Render tickmark on the number line
   * @param {number} type - type of tickMark, can be 1, 5  or 10.
   * @param {number} position - position along the y-axis for the tickmark, expressed as percentage of the full width
   *
   */ 
  renderTickMark(position: number, type: number = 10){
    const tickMarkInfo = {
      1: {y1: this.translator.yPosLine-2, y2: this.translator.yPosLine+2, strokeWidth: 1},
      5: {y1: this.translator.yPosLine-5, y2: this.translator.yPosLine+5, strokeWidth: 1},
      10: {y1: this.translator.yPosLine-8, y2: this.translator.yPosLine+8, strokeWidth: 2},
    }
    console.assert(type === 1 || type === 5 || type === 10);
    return svg`
      <line 
        x1 = "${position}"
        y1 = "${tickMarkInfo[type].y1}"
        x2 = "${position}"
        y2 = "${tickMarkInfo[type].y2}"
        style="stroke:rgb(0, 26, 255);stroke-width: ${tickMarkInfo[type].strokeWidth}" 
      />`
  }



  /** Render all multiple of 10 tickmarks
   * @return {svg} template for all multiple of 10 tickmarks.
   */
  render10TickMarks(): SVGTemplateResult {
    const positions = [];
    const numberTickMarks = (this.maximum - this.minimum)/10 + 1;
    console.log (`numberTickMarks = ${numberTickMarks}`);
    for (let i = 0; i < numberTickMarks; i++){ 
      positions.push(this.translator.translatePosition(this.minimum) + i * this.translator.numberDistanceToViewportDistance(10))
    }
    return svg`
      ${positions.map((pos) => this.renderTickMark(pos, 10))
      }
    `;
  }
  
  /** Render all multiple of 5 tickmarks
   * @return {svg} template for all multiple of 5 tickmarks.
   */
  render5TickMarks(): SVGTemplateResult {
    const positions = [];
    for (let i = this.translator.translatePosition(this.minimum+5); i < this.translator.translatePosition(this.maximum); i+=this.translator.numberDistanceToViewportDistance(10)){ 
      positions.push(i)
    }
    return svg`
      ${positions.map((pos) => this.renderTickMark(pos, 5))
      }
    `;
  }

   /** Render all single tickmarks
   * @return {svg} template for all single tickmarks.
   */
  render1TickMarks(): SVGTemplateResult {
    const positions = [];
    for (let i = this.translator.translatePosition(this.minimum+1); i < this.translator.translatePosition(this.maximum); i+=this.translator.numberDistanceToViewportDistance(1)){ 
      positions.push(i)
    }
    return svg`
      ${positions.map((pos) => this.renderTickMark(pos, 1))
      }
    `;
  }

  /** Render the number line itself
   * @return {svg} template for the number line.
   */
  renderNumberLine(): SVGTemplateResult{
    console.log(`renderNumberLine`);
    return svg`
      <line
        x1="${this.translator.translatePosition(this.minimum)}"
        y1="${this.translator.yPosLine}"
        x2="${this.translator.translatePosition(this.maximum)}"
        y2="${this.translator.yPosLine}"
        style="stroke:rgb(0, 26, 255);stroke-width: 2"
      />`
  }

  /** Render the numbers below the number line.
   * @return {svg} template for the numbers below the number line.
   */
  renderNumbers(): SVGTemplateResult{
    console.log(`renderNumbers`);
    return svg`
      <text x="${this.translator.translatePosition(this.minimum)}" y="${this.translator.yPosLine+10}" dominant-baseline="hanging" text-anchor="middle">${this.minimum}</text>
      <text x="${this.translator.translatePosition(this.maximum)}" y="${this.translator.yPosLine+10}" dominant-baseline="hanging" text-anchor="middle" >${this.maximum}</text>
    `;
  }

  

  render(): TemplateResult {
    console.log (`render photoPositions = ${this.photoPositions}`);
    return html` <div>
      <svg width="100%" viewBox="0 0 ${this.viewBoxWidth} 200">
        ${this.renderNumberLine()}
        ${this.renderNumbers()}        
        ${this.show10TickMarks ? this.render10TickMarks():"" }
        ${this.show5TickMarks ? this.render5TickMarks():"" }
        ${this.show1TickMarks ? this.render1TickMarks():"" }
        ${this.photos.map( (photo) => photo.render() )}
      </svg>
    </div>`
  }; 
};

customElements.define('getallen-lijn', GetallenLijn);
