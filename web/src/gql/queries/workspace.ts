import { gql } from "@apollo/client";

import { workspaceFragment } from "@reearth-cms/gql/fragments";

export const GET_WORKSPACES = gql`
  query GetWorkspaces {
    me {
      id
      name
      myWorkspace {
        id
        ...WorkspaceFragment
      }
      workspaces {
        id
        ...WorkspaceFragment
      }
    }
  }

  ${workspaceFragment}
`;

export const GET_WORKSPACE = gql`
  query GetWorkspace($id: ID!) {
    node(id: $id, type: WORKSPACE) {
      ... on Workspace {
        ...WorkspaceFragment
      }
    }
  }
`;

export const UPDATE_WORKSPACE = gql`
  mutation UpdateWorkspace($workspaceId: ID!, $name: String!) {
    updateWorkspace(input: { workspaceId: $workspaceId, name: $name }) {
      workspace {
        id
        ...WorkspaceFragment
      }
    }
  }
`;

export const DELETE_WORKSPACE = gql`
  mutation DeleteWorkspace($workspaceId: ID!) {
    deleteWorkspace(input: { workspaceId: $workspaceId }) {
      workspaceId
    }
  }
`;

export const ADD_USERS_TO_WORKSPACE = gql`
  mutation AddUsersToWorkspace($workspaceId: ID!, $users: [MemberInput!]!) {
    addUsersToWorkspace(input: { workspaceId: $workspaceId, users: $users }) {
      workspace {
        id
        ...WorkspaceFragment
      }
    }
  }
`;

export const UPDATE_MEMBER_OF_WORKSPACE = gql`
  mutation UpdateMemberOfWorkspace($workspaceId: ID!, $userId: ID!, $role: Role!) {
    updateUserOfWorkspace(input: { workspaceId: $workspaceId, userId: $userId, role: $role }) {
      workspace {
        id
        ...WorkspaceFragment
      }
    }
  }
`;

export const REMOVE_MULTIPLE_MEMBERS_FROM_WORKSPACE = gql`
  mutation RemoveMultipleMembersFromWorkspace($workspaceId: ID!, $userIds: [ID!]!) {
    removeMultipleMembersFromWorkspace(input: { workspaceId: $workspaceId, userIds: $userIds }) {
      workspace {
        id
        ...WorkspaceFragment
      }
    }
  }
`;

export const ADD_INTEGRATION_TO_WORKSPACE = gql`
  mutation AddIntegrationToWorkspace($workspaceId: ID!, $integrationId: ID!, $role: Role!) {
    addIntegrationToWorkspace(
      input: { workspaceId: $workspaceId, integrationId: $integrationId, role: $role }
    ) {
      workspace {
        id
        ...WorkspaceFragment
      }
    }
  }
`;

export const UPDATE_INTEGRATION_OF_WORKSPACE = gql`
  mutation UpdateIntegrationOfWorkspace($workspaceId: ID!, $integrationId: ID!, $role: Role!) {
    updateIntegrationOfWorkspace(
      input: { workspaceId: $workspaceId, integrationId: $integrationId, role: $role }
    ) {
      workspace {
        id
        ...WorkspaceFragment
      }
    }
  }
`;

export const REMOVE_INTEGRATION_FROM_WORKSPACE = gql`
  mutation RemoveIntegrationFromWorkspace($workspaceId: ID!, $integrationId: ID!) {
    removeIntegrationFromWorkspace(
      input: { workspaceId: $workspaceId, integrationId: $integrationId }
    ) {
      workspace {
        id
        ...WorkspaceFragment
      }
    }
  }
`;

export const CREATE_WORKSPACE = gql`
  mutation CreateWorkspace($name: String!) {
    createWorkspace(input: { name: $name }) {
      workspace {
        id
        ...WorkspaceFragment
      }
    }
  }
`;

export const GET_WORKSPACE_SETTINGS = gql`
  query GetWorkspaceSettings($workspaceId: ID!) {
    node(id: $workspaceId, type: WorkspaceSettings) {
      id
      ... on WorkspaceSettings {
        id
        tiles {
          resources {
            ... on TileResource {
              id
              type
              props {
                name
                url
                image
              }
            }
          }
          enabled
          selectedResource
        }
        terrains {
          resources {
            ... on TerrainResource {
              id
              type
              props {
                name
                url
                image
                cesiumIonAssetId
                cesiumIonAccessToken
              }
            }
          }
          enabled
          selectedResource
        }
      }
    }
  }
`;

export const UPDATE_WORKSPACE_SETTINGS = gql`
  mutation UpdateWorkspaceSettings(
    $id: ID!
    $tiles: ResourcesListInput
    $terrains: ResourcesListInput
  ) {
    updateWorkspaceSettings(input: { id: $id, tiles: $tiles, terrains: $terrains }) {
      workspaceSettings {
        id
        tiles {
          resources {
            ... on TileResource {
              id
              type
              props {
                name
                url
                image
              }
            }
          }
          enabled
          selectedResource
        }
        terrains {
          resources {
            ... on TerrainResource {
              id
              type
              props {
                name
                url
                image
                cesiumIonAssetId
                cesiumIonAccessToken
              }
            }
          }
          enabled
          selectedResource
        }
      }
    }
  }
`;
