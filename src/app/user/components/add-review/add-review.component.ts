import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Review } from 'src/app/shared/models/review';
import { UserService } from 'src/app/shared/services/user.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-review',
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.less']
})
export class AddReviewComponent implements OnInit {
  message: string;

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<AddReviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Review
  ) {}

  ngOnInit() {}

  async apply() {
    this.spinner.show();
    this.data.message = this.message;
    await this.userService.addReview(this.data);
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
