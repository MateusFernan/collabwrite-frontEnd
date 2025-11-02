import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-new-doc-redirect',
  template: `<div class="p-4 text-xs text-gray-500">Criando documento...</div>`,
})
export class NewDocRedirectComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const doc = this.route.snapshot.data['doc'];
    this.router.navigate(['/editor', doc.id], { replaceUrl: true });
  }
}
