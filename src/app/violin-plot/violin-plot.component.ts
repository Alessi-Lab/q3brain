import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {DataRow} from "../data-row";
import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';

PlotlyModule.plotlyjs = PlotlyJS;
@Component({
  selector: 'app-violin-plot',
  standalone: true,
  imports: [PlotlyModule],
  templateUrl: './violin-plot.component.html',
  styleUrl: './violin-plot.component.css'
})
export class ViolinPlotComponent {
  private _samples: {name: string, condition: string, location: string, group: string}[] = [];
  @Input() set samples(value: {name: string, condition: string, location: string, group: string}[]) {
    this._samples = value;
    console.log(value)
  }

  get samples(): {name: string, condition: string, location: string, group: string}[] {
    return this._samples;
  }


  private _data: DataRow|null = null;
  @Input() set data(value: DataRow) {
    this._data = value;
    this.graphLayout.title = this.data["Entry Name"] +" (" + this.data.PTM_collapse_key + ")";

    this.draw()
  }

  get data(): DataRow {
    return this._data!;
  }

  private _groupBy: string = "condition";
  @Input() set groupBy(value: string) {
    this._groupBy = value;
    if (this.samples.length > 0) {
      this.draw()
    }
  }

  get groupBy(): string {
    return this._groupBy;
  }

  graphData: any[] = [];
  graphLayout: any = {
    title: "Violin Plot",
    width: 1000,
    height: 500,
    xaxis: {
      title: "Sample"
    },
    yaxis: {
      title: "Log2 Intensity"
    }
  };
  defaultColorList: string[] = [
    "#fd7f6f",
    "#7eb0d5",
    "#b2e061",
    "#bd7ebe",
    "#ffb55a",
    "#ffee65",
    "#beb9db",
    "#fdcce5",
    "#8bd3c7",
  ]

  revision = 0;

  config: any = {
    toImageButtonOptions: {
      format: 'svg',
      filename: this.graphLayout.title.text,
      height: this.graphLayout.height,
      width: this.graphLayout.width,
      scale: 1,
      margin: this.graphLayout.margin,
    },
  }

  constructor(private cdr: ChangeDetectorRef) {
  }

  draw() {
    console.log("drawing")
    const temp: {[key: string]: any} = {}
    const groupBy = this.groupBy
    for (const sample of this.samples) {
      // @ts-ignore
      const group = sample[groupBy]
      if (!(group in temp)) {
        temp[group] = {
          x: [],
          y: [],
          name: group,
          type: 'violin',
          box: {
            visible: true
          },
          meanline: {
            visible: true
          },
          line: {
            color: 'black'
          },
          fillcolor: this.defaultColorList[Object.keys(temp).length % this.defaultColorList.length],
        }
      }
      const data = this.data[sample.name]
      if (data) {
        temp[group].x.push(group)
        temp[group].y.push(data)
      }
    }
    const graphData: any[] = []
    for (const key in temp) {
      graphData.push(temp[key])
    }
    this.graphData = graphData
    console.log(this.graphData)
    this.revision++
    console.log("drawing done")
  }
}
