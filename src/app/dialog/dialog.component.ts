import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  conditionList = ["Brand New", "Second Hand", "Refurbished"]
  productForm !: FormGroup;
  actionBtn: string = "save";

  constructor(private formBuilder: FormBuilder, private api: ApiService,
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any) { }
  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      condition: ['', Validators.required],
      price: ['', Validators.required],
      comment: ['', Validators.required],
      date: ['', Validators.required],
    })

    // console.log(this.editData);
    if (this.editData) {
      this.actionBtn = "Update"
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['date'].setValue(this.editData.date);
      this.productForm.controls['condition'].setValue(this.editData.condition);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comment'].setValue(this.editData.comment);
    }
  }

  addProduct() {
    // console.log(this.productForm.value); this is used to check whether our form values are binding or not. 

    if (!this.editData) {
      if (this.productForm.valid) {
        this.api.postProduct(this.productForm.value)
          .subscribe({
            next: (res) => {
              alert("product added sucessfully")
              this.productForm.reset();
              this.dialogRef.close('save');
            },
            error: () => {
              alert("Something went wrong")
            }
          })
      }
    }
    else {
      this.updateProduct()
    }
  }

  updateProduct() {
    this.api.updateProduct(this.productForm.value, this.editData.id)
      .subscribe({
        next: (res) => {
          alert("Product updated sucessfully")
          this.productForm.reset();
          this.dialogRef.close('update');
        },
        error: () => {
          alert("error while updating")
        }
      })
  }
}
