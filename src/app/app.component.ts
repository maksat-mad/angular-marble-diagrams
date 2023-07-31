import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, from, of, Observable, concat, interval } from 'rxjs';
import { delay, filter, map, flatMap, take, concatAll, concatMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'angular-marble-diagrams';
  subscription$: Subscription | undefined;

  ngOnInit() {

    // 1. filter
    const array = [2, 30, 22, 5, 60, 1];
    const observable$ = from(array);
    this.subscription$ = observable$.pipe(
      filter(value => value > 10)
    )
    .subscribe({
      next: (value) => {
        console.log(value);
      },
      error: (error) => {
        console.error('Error:', error);
      },
      complete: () => {
        console.log('Observable completed');
      }
    });
    // output: 30 22 60

    // 2. map
    const array = [1, 2, 3];
    const observable$ = from(array);
    this.subscription$ = observable$.pipe(
      map(value => value * 10)
    )
    .subscribe({
      next: (value) => {
        console.log(value);
      },
      error: (error) => {
        console.error('Error:', error);
      },
      complete: () => {
        console.log('Observable completed');
      }
    });
    // output: 10 20 30

    // 3. flatMap
    // flatMap deprecated in favor of using mergeMap, concatMap, or switchMap
    const array = [1, 2, 3, 4, 5];
    const source$: Observable<number[]> = of(array);

    const delayedOperation = (value: number) => of(value * 10).pipe(delay(1000));

    const result$ = source$.pipe(
      flatMap((array: number[]) => concat(...array.map((value) => delayedOperation(value))))
    );

    this.subscription$ = result$.subscribe({
      next: (value) => {
        console.log(value);
      },
      error: (error) => {
        console.error('Error:', error);
      },
      complete: () => {
        console.log('Observable completed');
      }
    });
    // output: 10 20 30 40 50

    // 4. concat, concatAll, concatMap
    const source1$ = interval(1000).pipe(
      map((value) => 'source 1: ' + value),
      take(5)
    );

    const source2$ = interval(500).pipe(
      map((value) => 'source 2: ' + value),
      take(3)
    );

    // 4.1 concat
    this.subscription$ = concat(source1$, source2$).subscribe({
      next: (value) => {
        console.log(value);
      }
    });
    // output: first source 1 then source 2

    // 4.2 concatAll
    this.subscription$ = source1$.pipe(
      map((value) => source2$),
      concatAll()
    )
    .subscribe({
      next: (value) => {
        console.log(value);
      }
    });
    // output: for each source 1 element, source 2 will run

    // 4.3 concatMap
    this.subscription$ = source1$.pipe(
      concatMap((value: any) => source2$)
    )
    .subscribe({
      next: (value) => {
        console.log(value);
      }
    });
    // output: like map + concatAll
  }

  ngOnDestroy() {
    this.subscription$?.unsubscribe();
  }
}
