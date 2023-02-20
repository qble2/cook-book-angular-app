import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { map, Observable, startWith } from "rxjs";
import { RecipeTagEnum } from "src/app/recipe/model/recipe-tag.enum";

@Component({
  selector: "app-chip-list",
  templateUrl: "./chip-list.component.html",
  styleUrls: ["./chip-list.component.scss"],
})
// XXX BKE for string & enum only for now
export class ChipListComponent implements OnInit, OnChanges {
  @ViewChild("chipInput") chipInput!: ElementRef<HTMLInputElement>;

  @Input() parentFormControl: FormControl = new FormControl<RecipeTagEnum[]>(
    []
  );
  @Input() label: string = "Chips";
  @Input() placeholder: string = "New chip...";
  @Input() availableChips: any[] = [];

  @Output() chipAddedEvent = new EventEmitter<any>();
  @Output() chipRemovedEvent = new EventEmitter<any>();

  chipAutocompleteFormControl = new FormControl<RecipeTagEnum | null>(null);

  filteredAvailableChips$?: Observable<any[]>;

  constructor() {}

  ngOnChanges() {
    this.parentFormControl.valueChanges.subscribe(() => {
      this.updateFilteredAvailableChips();
    });
  }

  ngOnInit(): void {
    if (this.availableChips) {
      this.updateFilteredAvailableChips();
    }
  }

  private updateFilteredAvailableChips(): void {
    this.filteredAvailableChips$ =
      this.chipAutocompleteFormControl.valueChanges.pipe(
        startWith(null),
        map((value: string | null) =>
          value
            ? this._filter(value)
            : this.availableChips.filter(
                (availableChip) =>
                  !this.parentFormControl?.value?.includes(availableChip)
              )
        )
      );
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.availableChips.filter(
      (availableChip) =>
        !this.parentFormControl?.value?.includes(availableChip) &&
        availableChip.toLowerCase().includes(filterValue)
    );
  }

  // handles adding a chip from the select drop-down list
  onChipOptionSelected(event: MatAutocompleteSelectedEvent): void {
    console.log(
      "onChipOptionSelected . parentFormControl",
      this.parentFormControl
    );
    // only add through selecting form drop-down list
    this.parentFormControl.setValue([
      ...this.parentFormControl.value,
      event.option.value,
    ]);

    // this.parentFormControl.updateValueAndValidity();
    this.chipInput.nativeElement.value = "";
    this.chipAutocompleteFormControl.setValue(null);

    //
    this.chipAddedEvent.emit(event.option.value);
  }

  // onChipRemoved(index: number): void {
  onChipRemoved(chip: any): void {
    // this.parentForm.controls[this.parentFormControlName]?.value.splice(
    //   index,
    //   1
    // );
    this.parentFormControl?.setValue(
      this.parentFormControl?.value.filter((c: any) => c !== chip)
    );

    //
    this.chipRemovedEvent.emit(chip);
  }
}
