import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Student } from 'src/app/dtos/student';

@Component({
  selector: 'app-student-delete',
  templateUrl: './student-delete.component.html',
  styleUrls: ['./student-delete.component.css']
})
export class StudentDeleteComponent implements OnInit {

  constructor(
    private dialogReference: MatDialogRef<StudentDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public studentDelete: Student,
  ) { }

  ngOnInit(): void {
  }

  confirmDelete(){
    if(this.studentDelete){
      this.dialogReference.close("delete");
    }
  }

}
