import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../../utils/api-url';

export interface FamilyPersonSearchResult {
  personId: string;
  fullName: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  profileImagePath?: string;
}

export interface FamilyGraphNode {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  profileImagePath?: string;
  depth: number;
  isRoot: boolean;
}

export interface FamilyGraphEdge {
  id: string;
  from: string;
  to: string;
  label: string;
}

export interface FamilyGraphResponse {
  rootPersonId: string;
  nodes: FamilyGraphNode[];
  edges: FamilyGraphEdge[];
}

export interface FamilyPersonRequest {
  personId?: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  notes?: string;
  profileImagePath?: string;
  linkedUserId?: string;
}

export interface FamilyRelationshipRequest {
  personId: string;
  relatedPersonId: string;
  relationshipType: string;
}

@Injectable({ providedIn: 'root' })
export class FamilyService {
  constructor(private http: HttpClient) {}

  searchPersons(name: string): Observable<any> {
    const params = new HttpParams().set('name', name);
    return this.http.get(API_URL.FAMILY_SEARCH, { params });
  }

  getGraph(personId: string, maxDepth = 5): Observable<any> {
    const params = new HttpParams().set('maxDepth', maxDepth.toString());
    return this.http.get(`${API_URL.FAMILY_GRAPH}/${personId}/graph`, { params });
  }

  addPerson(request: FamilyPersonRequest): Observable<any> {
    return this.http.post(API_URL.FAMILY_PERSON_ADD, request);
  }

  updatePerson(request: FamilyPersonRequest): Observable<any> {
    return this.http.put(API_URL.FAMILY_PERSON_UPDATE, request);
  }

  addRelationship(request: FamilyRelationshipRequest): Observable<any> {
    return this.http.post(API_URL.FAMILY_RELATIONSHIP_ADD, request);
  }

  deleteRelationship(relationshipId: string): Observable<any> {
    return this.http.delete(`${API_URL.FAMILY_RELATIONSHIP_DELETE}/${relationshipId}`);
  }
}
