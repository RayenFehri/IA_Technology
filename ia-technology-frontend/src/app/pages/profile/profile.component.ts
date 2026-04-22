import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profileForm: FormGroup;
  user: User | null = null;
  isLoading = true;
  isSaving = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.profileForm = this.fb.group({
      username: [{value: '', disabled: true}],
      email: ['', [Validators.required, Validators.email]],
      nom: ['', Validators.required],
      prenom: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.userService.getProfile().subscribe({
      next: (user: User) => {
        this.user = user;
        this.profileForm.patchValue({
          username: user.username,
          email: user.email,
          nom: user.nom,
          prenom: user.prenom
        });
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger le profil.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) return;

    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';

    const dataToUpdate = {
      email: this.profileForm.get('email')?.value,
      nom: this.profileForm.get('nom')?.value,
      prenom: this.profileForm.get('prenom')?.value
    };

    this.userService.updateProfile(dataToUpdate).subscribe({
      next: (updatedUser: User) => {
        this.user = updatedUser;
        this.successMessage = 'Profil mis à jour avec succès.';
        this.isSaving = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la mise à jour du profil.';
        this.isSaving = false;
      }
    });
  }
}
