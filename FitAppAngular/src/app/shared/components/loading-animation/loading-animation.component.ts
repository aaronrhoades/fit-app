import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-animation',
  imports: [],
  templateUrl: './loading-animation.component.html',
  styleUrl: './loading-animation.component.scss',
})
export class LoadingAnimationComponent implements OnInit {
  showLoader = false;
  ngOnInit() {
    // Add a slight delay before showing the loader to prevent flickering for fast loads
    setTimeout(() => {
      this.showLoader = true;
    }, 500);
  }
}
