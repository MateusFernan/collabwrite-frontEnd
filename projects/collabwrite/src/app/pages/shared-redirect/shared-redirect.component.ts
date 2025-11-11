import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../core/services/shared.service';

@Component({
  selector: 'app-share-redirect',
  standalone: true,
  template: `
    <div class="flex flex-col items-center justify-center h-full p-6 font-mono">
      <p class="text-lg animate-pulse">Abrindo documento colaborativo...</p>
    </div>
  `,
})
export class ShareRedirectComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private shared = inject(SharedService);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.shared.getSharedDoc(id).subscribe({
      next: (res) => {
        localStorage.setItem('tempToken', res.tokenTemporario);
        this.router.navigate(['/editor-colab', res.docId], {
          replaceUrl: true,
        });
      },
      error: () => this.router.navigate(['/register']),
    });
  }
}
