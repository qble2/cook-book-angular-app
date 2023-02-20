import * as moment from "moment";

export class DateUtils {
  public static _instance: DateUtils;

  private constructor() {
    moment.relativeTimeThreshold("s", 60);
    moment.relativeTimeThreshold("m", 60);
    moment.relativeTimeThreshold("h", 24);
  }

  public static getInstance(): DateUtils {
    return this._instance || (this._instance = new this());
  }

  toMinutes(durationISO8601: any): number {
    return moment.duration(durationISO8601).asMinutes();
  }

  toDurationISO8601(minutes: number): any {
    if (minutes) {
      return "PT" + minutes + "M";
    }
    return "PT1M";
  }

  public humanizeDuration(duration: string): string {
    return moment.duration(duration).humanize();
  }

  public humanizeMinutes(minutes: number): string {
    const duration = moment.duration(minutes, "minutes");
    return this.humanizeDurationNoThresholdRounding(duration);
  }

  public timeElapsedFromNow(date: Date): string {
    return moment(date).fromNow();
  }

  private humanizeDurationNoThresholdRounding(
    momentDuration: moment.Duration
  ): string {
    // let momentDuration = moment.duration(duration);
    let hours: number = momentDuration.hours();
    let minutes: number = momentDuration.minutes();

    let hoursString: string = "";
    let minutesString: string = "";

    if (hours) {
      hoursString += hours;
      hoursString += hours > 1 ? " hours" : " hour";
    }

    if (minutes) {
      minutesString += minutes;
      minutesString += minutes > 1 ? " minutes" : " minute";
    }

    return [hoursString, minutesString].filter(Boolean).join(" "); // filter empty values
  }
}
