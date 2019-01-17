import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Review } from 'src/app/shared/models/review';
import { UserService } from 'src/app/shared/services/user.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from 'firebase';

@Component({
  selector: 'app-add-review',
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.less']
})
export class AddReviewComponent implements OnInit {
  stars: Number;
  message: string;

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<AddReviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User; review: Review }
  ) {}

  ngOnInit() {
    this.stars = this.data.review.stars;
  }

  async addReview() {
    this.spinner.show();
    this.data.review.message = this.message;
    await this.userService.addReview(this.data.user, this.data.review);
    this.spinner.hide();
    this.messageService.showMessage({
      type: 'success',
      text: 'The review has been added succesfully.',
      header: 'Success'
    });
    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
