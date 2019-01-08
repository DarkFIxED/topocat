import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'tc-confirmation-dialog',
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {
    title: string;
    content: string;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
        this.title = data.title;
        this.content = data.content;
    }

    ngOnInit() {
    }
}
