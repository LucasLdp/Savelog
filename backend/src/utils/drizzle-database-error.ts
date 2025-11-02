import { ConflictException } from "http-essentials";
import { getViolatedConstraint, isUniqueViolation } from "./database-error";

type ConstraintMessages = Record<string, string>;

export function handleUniqueConstraint(constraintMessages: ConstraintMessages) {
  return (error: any): never => {
    if (isUniqueViolation(error)) {
      const constraint = getViolatedConstraint(error);

      for (const [key, message] of Object.entries(constraintMessages)) {
        if (constraint?.includes(key)) {
          throw new ConflictException(message);
        }
      }
      throw new ConflictException("Registro já existe");
    }
    throw error;
  };
}
