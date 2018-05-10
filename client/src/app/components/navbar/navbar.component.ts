import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ContextService} from '../../services/context.service';
import {Router} from '@angular/router';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  @Input() showName: boolean;
  @Output() nameClick: EventEmitter<number>;
  clickCount = 0;

  constructor(public context: ContextService, public router: Router) {
    this.nameClick = new EventEmitter<number>();
  }

  ngOnInit() {
  }

  logout(): void {
    this.router.navigate(['login']).then((value: any) => {
      this.context.user = null;
    }).catch((err: any) => {
      console.log(err);
    });
  }

  clickName(): void {
    this.nameClick.emit(++this.clickCount);
  }
}
