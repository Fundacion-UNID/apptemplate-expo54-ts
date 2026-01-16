import { JwkSet } from 'gdc-common-utils-ts/models/jwk';

/**
 * Defines the structure of a user profile object.
 * This interface is the central representation of a user's identity and state
 * within the application, whether anonymous or fully registered.
 */
export interface Profile {
  /**
   * A unique identifier for the profile. This may be a temporary UUID
   * for anonymous profiles or a persistent identifier from the backend.
   */
  id: string;

  /**
   * A flag indicating whether the profile is for an anonymous user session.
   * Anonymous profiles are typically used before a user has fully registered.
   */
  isAnonymous: boolean;

  /**
   * The ISO 8601 date string representing when the profile was created.
   */
  createdAt: string;

  /**
   * The set of public keys associated with the profile, conforming to the
   * JSON Web Key (JWK) Set standard. These are used for cryptographic
   * operations like signing and encryption.
   */
  keys: JwkSet;

  /**
   * The current status of the profile, indicating its lifecycle stage.
   * - 'pending': The profile has been created but is not yet fully active.
   * - 'active': The profile is fully registered and operational.
   * - 'revoked': The profile has been deactivated and is no longer valid.
   */
  status?: 'pending' | 'active' | 'revoked';

  /**
   * Allows for additional, untyped properties to be added to the profile object.
   * This provides flexibility for extending the profile with new attributes
   * without breaking the core interface.
   */
  [key: string]: any;
}
