import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "basicSorterPipe",
})
export class basicSorterPipePipe implements PipeTransform {
  transform(value: any[], ...args: unknown[]): any[] {
    if (value) {
      return value.sort((a, b) => a.localeCompare(b));
    }
    return value;
  }
}
