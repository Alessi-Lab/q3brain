import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {DataFrame, fromCSV, IDataFrame} from "data-forge";
import {DataRow} from "./data-row";
import {WebService} from "./web.service";
import {ViolinPlotComponent} from "./violin-plot/violin-plot.component";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ViolinPlotComponent, MatFormField, MatSelect, MatOption, MatLabel, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'q3brain';
  df: IDataFrame<DataRow> = new DataFrame()
  samples: {name: string, condition: string, location: string, group: string}[] = []
  nonDataColumns: string[] = [
   "PTM_collapse_key", "EG.ModifiedPeptide", "PEP.StrippedSequence", "PG.UniProtIds", "PTM_localization", "primaryID", "From", "Entry", "Entry Name"
  ]

  groupVar: string = 'condition'
  displayDataRows: DataRow[] = []
  proteinSelected: string = "all"

  constructor(private web: WebService) {
    this.web.getFileLocation('normalized_filtered_rab.txt').subscribe(
      (data) => {
        // @ts-ignore
        this.df = fromCSV(data, {delimiter: '\t'})
        this.displayDataRows = this.df.toArray()

        this.df.getColumnNames().forEach((col) => {
            if (!this.nonDataColumns.includes(col)) {
              const splitted = col.split(".")
              this.samples.push({name: col, condition: splitted[0], location: splitted[1], group: splitted[0]+"."+splitted[1]})
            }
          }
        )
      }
    )
  }
}
