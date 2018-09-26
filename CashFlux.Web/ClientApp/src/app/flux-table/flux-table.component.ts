import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AppState } from '../app.state';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as FluxActions from '../actions/flux.actions';
import { FluxTableModel } from '../models/flux-table.model';
import { selectFluxTableModels } from '../reducers/flux.reducer';
import { WarningComponent } from '../warning/warning.component';

@Component({
  selector: 'app-flux-table',
  templateUrl: './flux-table.component.html',
  styleUrls: ['./flux-table.component.css']
})
export class FluxTableComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;

  // Table resources
  readonly displayedColumns = ['select', 'amount', 'source', 'category', 'timeCreated'];
  dataSource = new MatTableDataSource<FluxTableModel>();
  selection = new SelectionModel<FluxTableModel>(true, []);
  fluxesSubscription: Subscription;

  constructor(private _store: Store<AppState>, public dialog: MatDialog) { }

  ngOnInit(): void {
    // Fluxes state
    // Selects fluxes within selected profile and returns them as FluxTableModel.
    this.fluxesSubscription = this._store.select(selectFluxTableModels)
      .subscribe(data => {
        this.dataSource.data = data;
      });

    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.fluxesSubscription.unsubscribe();
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Returns true if all rows are selected
   */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /**
   * Selects all rows if they are not all selected; otherwise clear selection.
   */
  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      // Only select filtered data inorder to only select the data
      // that is currently visible
      this.dataSource.filteredData.forEach(row => this.selection.select(row));
  }

  /**
   * Remove selected items from store.
   * Clears selection model.
   */
  removeSelectedRows(): void {
    const fluxesToDelete = this.selection.selected.map(flux => flux.id);
    this._store.dispatch(new FluxActions.RemoveFluxes(fluxesToDelete));

    // Reset selection model
    this.selection = new SelectionModel<FluxTableModel>(true, []);
  }

  openWarningDialog(): void {
    const dialogRef = this.dialog.open(WarningComponent, {
      height: '200px',
      autoFocus: true,
      data: {
        message: 'Are you sure you want to do this?'
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result === true) {
        this.removeSelectedRows();
      }
    });
  }
}
