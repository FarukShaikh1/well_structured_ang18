import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Network, DataSet } from 'vis-network/standalone';
import {
  FamilyService,
  FamilyGraphNode,
  FamilyGraphEdge,
  FamilyPersonSearchResult,
  FamilyPersonRequest,
  FamilyRelationshipRequest,
} from '../../services/family/family.service';

interface VisNode {
  id: string;
  label: string;
  title?: string;
  color?: { background: string; border: string };
  shape?: string;
  font?: { color: string };
}

interface VisEdge {
  id: string;
  from: string;
  to: string;
  label: string;
  arrows?: string;
  font?: { align: string };
}

@Component({
  selector: 'app-family-graph',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './family-graph.component.html',
  styleUrls: ['./family-graph.component.scss'],
})
export class FamilyGraphComponent implements AfterViewInit, OnDestroy {
  @ViewChild('graphCanvas') graphCanvas!: ElementRef<HTMLDivElement>;

  // Search
  searchQuery = '';
  searchResults: FamilyPersonSearchResult[] = [];
  isSearching = false;

  // Graph state
  selectedPerson: FamilyPersonSearchResult | null = null;
  maxDepth = 5;
  isLoadingGraph = false;
  graphError = '';

  // Add person form
  showAddPersonForm = false;
  newPerson: FamilyPersonRequest = { firstName: '', lastName: '' };
  isSavingPerson = false;

  // Add relationship form
  showAddRelationshipForm = false;
  newRelationship: FamilyRelationshipRequest = {
    personId: '',
    relatedPersonId: '',
    relationshipType: '',
  };
  relationshipTypes = ['Father', 'Mother', 'Child', 'Sibling', 'Spouse'];
  isSavingRelationship = false;

  // Status messages
  statusMessage = '';
  statusType: 'success' | 'error' = 'success';

  private network: Network | null = null;
  private nodes = new DataSet<VisNode>([]);
  private edges = new DataSet<VisEdge>([]);

  constructor(private familyService: FamilyService) {}

  ngAfterViewInit(): void {
    this.initNetwork();
  }

  ngOnDestroy(): void {
    this.network?.destroy();
  }

  private initNetwork(): void {
    const options = {
      nodes: {
        shape: 'dot',
        size: 20,
        font: { size: 14, color: '#343a40' },
        borderWidth: 2,
      },
      edges: {
        arrows: { to: { enabled: true, scaleFactor: 0.8 } },
        font: { size: 12, align: 'middle' },
        color: { color: '#6c757d', highlight: '#0d6efd' },
        smooth: { type: 'curvedCW', roundness: 0.2 } as any,
      },
      physics: {
        enabled: true,
        solver: 'forceAtlas2Based',
        forceAtlas2Based: { gravitationalConstant: -60, springLength: 120 },
        stabilization: { iterations: 150 },
      },
      interaction: { hover: true, tooltipDelay: 200 },
      layout: { improvedLayout: true },
    };

    this.network = new Network(
      this.graphCanvas.nativeElement,
      { nodes: this.nodes, edges: this.edges },
      options
    );
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) return;
    this.isSearching = true;
    this.searchResults = [];

    this.familyService.searchPersons(this.searchQuery.trim()).subscribe({
      next: (res: any) => {
        this.searchResults = res?.data ?? [];
        this.isSearching = false;
      },
      error: () => {
        this.isSearching = false;
        this.showStatus('Search failed. Please try again.', 'error');
      },
    });
  }

  selectPerson(person: FamilyPersonSearchResult): void {
    this.selectedPerson = person;
    this.searchResults = [];
    this.searchQuery = person.fullName;
    this.loadGraph(person.personId);
  }

  loadGraph(personId: string): void {
    this.isLoadingGraph = true;
    this.graphError = '';

    this.familyService.getGraph(personId, this.maxDepth).subscribe({
      next: (res: any) => {
        this.isLoadingGraph = false;
        const graph = res?.data;
        if (!graph) {
          this.graphError = 'No graph data returned.';
          return;
        }
        this.renderGraph(graph.nodes, graph.edges, graph.rootPersonId);
      },
      error: () => {
        this.isLoadingGraph = false;
        this.graphError = 'Failed to load graph. Please try again.';
      },
    });
  }

  private renderGraph(
    nodes: FamilyGraphNode[],
    edges: FamilyGraphEdge[],
    rootId: string
  ): void {
    const visNodes: VisNode[] = nodes.map((n) => ({
      id: n.id,
      label: n.label || `${n.firstName} ${n.lastName}`,
      title: this.buildTooltip(n),
      color: n.isRoot
        ? { background: '#0d6efd', border: '#0a58ca' }
        : n.gender === 'M'
        ? { background: '#cfe2ff', border: '#6ea8fe' }
        : n.gender === 'F'
        ? { background: '#f8d7da', border: '#f1aeb5' }
        : { background: '#e2e3e5', border: '#adb5bd' },
      font: { color: n.isRoot ? '#ff0000' : '#343a40' },
    }));

    const visEdges: VisEdge[] = edges.map((e) => ({
      id: e.id,
      from: e.from,
      to: e.to,
      label: e.label,
      font: { align: 'middle' },
    }));

    this.nodes.clear();
    this.edges.clear();
    this.nodes.add(visNodes);
    this.edges.add(visEdges);

    // Focus on root after stabilization
    this.network?.once('stabilized', () => {
      if (rootId) this.network?.focus(rootId, { scale: 1.2, animation: true });
    });
  }

  private buildTooltip(n: FamilyGraphNode): string {
    const dob = n.dateOfBirth
      ? new Date(n.dateOfBirth).toLocaleDateString('en-GB', {
          day: '2-digit', month: 'short', year: 'numeric',
        })
      : 'Unknown';
    const gender = n.gender === 'M' ? 'Male' : n.gender === 'F' ? 'Female' : 'Unknown';
    return `<b>${n.label}</b><br>DOB: ${dob}<br>Gender: ${gender}<br>Depth: ${n.depth}`;
  }

  // ── Add Person ────────────────────────────────────────────────────────────

  toggleAddPersonForm(): void {
    this.showAddPersonForm = !this.showAddPersonForm;
    if (this.showAddPersonForm) {
      this.newPerson = { firstName: '', lastName: '' };
    }
  }

  savePerson(): void {
    if (!this.newPerson.firstName.trim() || !this.newPerson.lastName.trim()) {
      this.showStatus('First name and last name are required.', 'error');
      return;
    }
    this.isSavingPerson = true;
    this.familyService.addPerson(this.newPerson).subscribe({
      next: () => {
        this.isSavingPerson = false;
        this.showAddPersonForm = false;
        this.showStatus('Person added successfully.', 'success');
      },
      error: () => {
        this.isSavingPerson = false;
        this.showStatus('Failed to add person.', 'error');
      },
    });
  }

  // ── Add Relationship ──────────────────────────────────────────────────────

  toggleAddRelationshipForm(): void {
    this.showAddRelationshipForm = !this.showAddRelationshipForm;
    if (this.showAddRelationshipForm) {
      this.newRelationship = {
        personId: this.selectedPerson?.personId ?? '',
        relatedPersonId: '',
        relationshipType: '',
      };
    }
  }

  saveRelationship(): void {
    const r = this.newRelationship;
    if (!r.personId || !r.relatedPersonId || !r.relationshipType) {
      this.showStatus('All relationship fields are required.', 'error');
      return;
    }
    this.isSavingRelationship = true;
    this.familyService.addRelationship(r).subscribe({
      next: () => {
        this.isSavingRelationship = false;
        this.showAddRelationshipForm = false;
        this.showStatus('Relationship added successfully.', 'success');
        if (this.selectedPerson) this.loadGraph(this.selectedPerson.personId);
      },
      error: () => {
        this.isSavingRelationship = false;
        this.showStatus('Failed to add relationship.', 'error');
      },
    });
  }

  private showStatus(msg: string, type: 'success' | 'error'): void {
    this.statusMessage = msg;
    this.statusType = type;
    setTimeout(() => (this.statusMessage = ''), 4000);
  }
}
