import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[appManoDirektyva]'
})
export class ManoDirektyvaDirective {
  el: ElementRef;

  constructor(element: ElementRef) {
    console.log('Direktyva priskirta komponentui');
    // element.nativeElement.style.backgroundColor = 'red';
    this.el = element;
  }

  @HostListener('click') onClick() {
    window.alert('Test');
    this.el.nativeElement.style.fontSize = '22px';
  }
}
