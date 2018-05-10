import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../services/http.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {

  constructor(public httpService: HttpService) {
  }

  ngOnInit() {
  }

  onFileSelected(ev: any): void {
    console.log(ev.target.files);

    try {
      let file = ev.target.files[0];
      console.log(file);
      this.httpService.uploadImage(file).subscribe({
        next: () => {
          console.log('File uploaded');
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    } catch (err) {
      console.log(err);
    }

  }

}
