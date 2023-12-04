import { Component,OnInit,AfterViewInit,ViewChild ,Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Student } from './dtos/student';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog,MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { StudentService } from './services/student.service';
import * as moment from 'moment';
import { SafeResourceUrlWithIconOptions } from '@angular/material/icon';
import { StudentDeleteComponent } from './student-delete/student-delete.component';
import { MAT_DATE_FORMATS } from '@angular/material/core';


export const MY_DATE_FORMATS = {
  parse: {
    dateinput: 'DD/MM/YYYY',
  },
  display: {
    dateinput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dataA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})

export class AppComponent implements OnInit,AfterViewInit {
  displayedColumns:string[]=['firstname','lastname','mobile','email','nic'];
  dataStudent=new MatTableDataSource<Student>();
  gridWidth:string="100";
  panalWidth:string="0";
  showDetail:boolean=false;
  formStudent: FormGroup;
  action: string = "Add";
  actionButton: string = "Save";
  studentData: Student;
  studentid:number=0;

  @ViewChild(MatPaginator)paginator!:MatPaginator;

  constructor(
    private _snackbar:MatSnackBar,
    private _studentService:StudentService,
    private dialog:MatDialog,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
  ){
    this.formStudent = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(9),Validators.maxLength(10),]],
      email: ['', Validators.required],
      nic: ['', Validators.required],
      address: ['', Validators.required],
      dateofbirth: ['', Validators.required],

    });
  }

  applyFilter(event:Event){
    const filtervalue=(event.target as HTMLInputElement).value;
    this.dataStudent.filter=filtervalue.trim().toLowerCase();
  }

  showStudents(){
    this._studentService.getList().subscribe({
      next:(data) =>{
        if(data.status){
          this.dataStudent.data=data.value;
  
        }
      },
      error:(e)=>{}
    }) 
  }



  ngOnInit(): void {
    this.showStudents();
    
  }

  ngAfterViewInit(): void {
    this.dataStudent.paginator=this.paginator;

    
  }

  addnewStudent(){
    
    let toDate=Date();

    if(this.showDetail==false)
    {
      this.action = "Add";
      this.actionButton = "Save";
      this.gridWidth="60";
      this.panalWidth="30";
      this.showDetail=true;
      this.formStudent.patchValue({
        firstname: "",
        lastname: "",
        mobile: "",
        email: "",
        nic: "",
        address: "",
        dateofbirth: moment(toDate, 'DD/MM/YYYY')
      })

    }
  }

  showdetail(student:Student){

    if(this.showDetail==false)
    {
      this.studentData=student;
      this.gridWidth="60";
      this.panalWidth="30";
      this.showDetail=true;
      this.studentid=student.studentId;
      this.formStudent.patchValue({
        firstname: student.firstname,
        lastname: student.lastname,
        mobile: student.mobile,
        email: student.email,
        nic: student.nic,
        address: student.address,
        dateofbirth: moment(student.dateofbirth, 'DD/MM/YYYY')
      })
      this.action = "Edit";
      this.actionButton = "Update";
    }
    else
    {
      this.studentid=0;
      this.gridWidth="90";
      this.panalWidth="0";
      this.showDetail=false;
    }


  }

  hidedetail(){
      this.studentid=0;
      this.gridWidth="90";
      this.panalWidth="0";
      this.showDetail=false;

  }

  showAlert(msg: string, title: string) {
    this._snackbar.open(msg, title, {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 3000
    })

  }

  deleteStudent(){
    this.dialog.open(StudentDeleteComponent,{
      disableClose:true,
      data:this.studentData,
    }).afterClosed().subscribe(result=>{
      if(result==="delete"){
        this._studentService.delete(this.studentData.studentId).subscribe({
          next:(data)=>{
            if(data.status){
              this.showAlert("Student was deleted","success");
              this.hidedetail();
              this.showStudents();
            }
            else
              this.showAlert("Could not Delete","error");
          },
          error:(e)=>{}
        })
      }
    });
  }

  addEditStudent() {
    const model: Student = {
      studentId: this.studentid == null || this.studentid==0 ? 0 : this.studentid,
      firstname: this.formStudent.value.firstname,
      lastname: this.formStudent.value.lastname,
      mobile: this.formStudent.value.mobile,
      email: this.formStudent.value.email,
      nic: this.formStudent.value.nic,
      address: this.formStudent.value.address,
      dateofbirth: moment(this.formStudent.value.dateofbirth).format('DD/MM/YYYY')
    }

    if (this.studentid == null || this.studentid==0) {
      this._studentService.add(model).subscribe({
        next: (data) => {
          if (data.status) {
            this.showAlert("Student was Created!", "success");
            this.showStudents();
          } else
            this.showAlert("could not create", "Error");

        },
        error: (e) => { }
      })
    }
    else{
      this._studentService.update(model).subscribe({
        next: (data) => {
          if (data.status) {
            this.showAlert("Student was edited!", "success");
            this.showStudents();
          } else
            this.showAlert("could not edit", "Error");

        },
        error: (e) => { }
      })     
    }
  }
}
