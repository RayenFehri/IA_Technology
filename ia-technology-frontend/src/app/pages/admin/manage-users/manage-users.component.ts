import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {
  users: User[] = [];
  isLoading = true;
  deleteModalOpen = false;
  userToDelete: User | null = null;
  isDeleting = false;
  currentUsername = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.currentUsername = this.authService.getUser()?.username || '';
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (data: User[]) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Erreur chargement utilisateurs', err);
        this.isLoading = false;
      }
    });
  }

  changeRole(id: number | undefined, role: string): void {
    if (!id) return;
    const me = this.authService.getUser();
    if (me && me.id === id) {
      this.toast.showError('Vous ne pouvez pas modifier votre propre rôle');
      return;
    }
    this.userService.updateUserRole(id, role).subscribe({
      next: () => {
        this.toast.showSuccess('Rôle mis à jour avec succès');
        const user = this.users.find(u => u.id === id);
        if (user) user.roles = [{ name: role }];
      },
      error: () => this.toast.showError('Erreur lors de la mise à jour du rôle')
    });
  }

  openDeleteModal(user: User): void {
    if (user.username === this.currentUsername) {
      this.toast.showError('Vous ne pouvez pas supprimer votre propre compte');
      return;
    }
    this.userToDelete = user;
    this.deleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.deleteModalOpen = false;
    this.userToDelete = null;
  }

  confirmDeleteUser(): void {
    if (!this.userToDelete?.id) return;
    this.isDeleting = true;
    this.userService.deleteUser(this.userToDelete.id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== this.userToDelete!.id);
        this.toast.showSuccess('Utilisateur supprimé avec succès');
        this.closeDeleteModal();
        this.isDeleting = false;
      },
      error: (err) => {
        this.toast.showError(err.error?.message || 'Erreur lors de la suppression');
        this.closeDeleteModal();
        this.isDeleting = false;
      }
    });
  }

  hasRole(user: any, roleName: string): boolean {
    if (!user.roles) return false;
    return user.roles.some((r: any) => r.name === roleName);
  }
}
