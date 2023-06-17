import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-create-post',
    templateUrl: './create-post.component.html',
    styleUrls: ['./create-post.component.scss'],
    standalone: true,
    imports: [MatCardModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule]
})
export class CreatePostComponent {

}
