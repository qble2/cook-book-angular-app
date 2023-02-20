import {
  BooleanInput,
  coerceBooleanProperty,
  coerceNumberProperty,
  NumberInput,
} from "@angular/cdk/coercion";
import {
  Component,
  ContentChild,
  Input,
  Optional,
  Self,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import {
  AbstractControl,
  ControlValueAccessor,
  FormGroupDirective,
  NgControl,
  NgForm,
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { MatInput } from "@angular/material/input";

@Component({
  selector: "app-password-form-field",
  templateUrl: "./password-form-field.component.html",
  styleUrls: ["./password-form-field.component.scss"],
})
export class PasswordFormFieldComponent
  implements ControlValueAccessor, ErrorStateMatcher
{
  @ViewChild(MatInput) matInput!: MatInput;

  @ContentChild("additionalValidationErrors")
  additionalValidationErrors!: TemplateRef<any>;

  @Input() label: string | null = null;

  hidePassword: boolean = true;

  value: any = null;
  touched: boolean = false;
  focused: boolean = false;

  onChange: Function = (_: any) => {};
  onTouched: Function = () => {};

  // Using `coerceBooleanProperty` allows for the required value of an element to be set as
  // `<my-element required></my-element>` instead of `<my-element [required]="true"></my-element>`.
  // It also allows for a string to be passed like `<my-element required="true"></my-element>`.
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: BooleanInput) {
    this._required = coerceBooleanProperty(value);
  }
  _required: boolean = false;

  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
  }
  _disabled: boolean = false;

  @Input()
  get minlength(): number {
    return this._minlength;
  }
  set minlength(value: NumberInput) {
    this._minlength = coerceNumberProperty(value);
  }
  _minlength: number = 0;

  get matcher() {
    return this;
  }

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (ngControl !== null) {
      ngControl.valueAccessor = this;
    }
  }

  isErrorState(
    control: AbstractControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return this.touched && (this.ngControl.control?.invalid ?? false);
  }

  writeValue(obj: any): void {
    this.value = obj;
  }
  // called by the parent form component only
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  // called by the parent form component only
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  // called by the parent form component only
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: any): void {
    this.value = event.currentTarget.value;
    this.onChange(this.value); // reporting back to the parent form component
  }

  onFocusIn(event: FocusEvent) {
    if (!this.focused) {
      this.focused = true;
      // this.stateChanges.next();
    }
  }

  onFocusOut(event: any): void {
    this.touched = true;
    this.focused = false;
    this.onTouched(); // reporting back to the parent form component
    // this.stateChanges.next();
    this.matInput.updateErrorState();
  }
}
