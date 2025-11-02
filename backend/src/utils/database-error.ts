export enum DatabaseErrorType {
  UNIQUE_VIOLATION = "UNIQUE_VIOLATION",
  FOREIGN_KEY_VIOLATION = "FOREIGN_KEY_VIOLATION",
  NOT_NULL_VIOLATION = "NOT_NULL_VIOLATION",
  CHECK_VIOLATION = "CHECK_VIOLATION",
  INVALID_TEXT = "INVALID_TEXT",
  NUMERIC_OUT_OF_RANGE = "NUMERIC_OUT_OF_RANGE",
  STRING_TOO_LONG = "STRING_TOO_LONG",
  UNKNOWN = "UNKNOWN",
}

export enum PostgresErrorCode {
  UNIQUE_VIOLATION = "23505",
  FOREIGN_KEY_VIOLATION = "23503",
  NOT_NULL_VIOLATION = "23502",
  CHECK_VIOLATION = "23514",
  STRING_TOO_LONG = "22001",
  NUMERIC_OUT_OF_RANGE = "22003",
  INVALID_TEXT = "22P02",
}

export enum MySQLErrorCode {
  UNIQUE_VIOLATION = 1062,
  FOREIGN_KEY_VIOLATION_DELETE = 1451,
  FOREIGN_KEY_VIOLATION_INSERT = 1452,
  NOT_NULL_VIOLATION = 1048,
  CHECK_VIOLATION = 3819,
  STRING_TOO_LONG = 1406,
  NUMERIC_OUT_OF_RANGE = 1264,
}

export interface ParsedDatabaseError {
  type: DatabaseErrorType;
  constraint?: string;
  table?: string;
  column?: string;
  detail?: string;
  originalError: any;
}

const POSTGRES_ERROR_MAP: Record<string, DatabaseErrorType> = {
  [PostgresErrorCode.UNIQUE_VIOLATION]: DatabaseErrorType.UNIQUE_VIOLATION,
  [PostgresErrorCode.FOREIGN_KEY_VIOLATION]:
    DatabaseErrorType.FOREIGN_KEY_VIOLATION,
  [PostgresErrorCode.NOT_NULL_VIOLATION]: DatabaseErrorType.NOT_NULL_VIOLATION,
  [PostgresErrorCode.CHECK_VIOLATION]: DatabaseErrorType.CHECK_VIOLATION,
  [PostgresErrorCode.STRING_TOO_LONG]: DatabaseErrorType.STRING_TOO_LONG,
  [PostgresErrorCode.NUMERIC_OUT_OF_RANGE]:
    DatabaseErrorType.NUMERIC_OUT_OF_RANGE,
  [PostgresErrorCode.INVALID_TEXT]: DatabaseErrorType.INVALID_TEXT,
};

const MYSQL_ERROR_MAP: Record<number, DatabaseErrorType> = {
  [MySQLErrorCode.UNIQUE_VIOLATION]: DatabaseErrorType.UNIQUE_VIOLATION,
  [MySQLErrorCode.FOREIGN_KEY_VIOLATION_DELETE]:
    DatabaseErrorType.FOREIGN_KEY_VIOLATION,
  [MySQLErrorCode.FOREIGN_KEY_VIOLATION_INSERT]:
    DatabaseErrorType.FOREIGN_KEY_VIOLATION,
  [MySQLErrorCode.NOT_NULL_VIOLATION]: DatabaseErrorType.NOT_NULL_VIOLATION,
  [MySQLErrorCode.CHECK_VIOLATION]: DatabaseErrorType.CHECK_VIOLATION,
  [MySQLErrorCode.STRING_TOO_LONG]: DatabaseErrorType.STRING_TOO_LONG,
  [MySQLErrorCode.NUMERIC_OUT_OF_RANGE]: DatabaseErrorType.NUMERIC_OUT_OF_RANGE,
};

function isPostgresError(error: any): boolean {
  // Verifica se o erro tem code diretamente ou dentro de cause (Drizzle ORM)
  const code = error.code || error.cause?.code;
  return code && typeof code === "string" && /^[0-9A-Z]{5}$/.test(code);
}

function isMySQLError(error: any): boolean {
  return typeof error.errno === "number";
}

function isSQLiteError(error: any): boolean {
  return (
    error.code &&
    typeof error.code === "string" &&
    error.code.startsWith("SQLITE")
  );
}

function parsePostgresError(error: any): ParsedDatabaseError {
  const pgError = error.cause || error;

  return {
    type: POSTGRES_ERROR_MAP[pgError.code] || DatabaseErrorType.UNKNOWN,
    constraint: pgError.constraint,
    table: pgError.table,
    column: pgError.column,
    detail: pgError.detail,
    originalError: error,
  };
}

function parseMySQLError(error: any): ParsedDatabaseError {
  const constraintMatch = error.sqlMessage?.match(/for key '(.+?)'/);
  const columnMatch = error.sqlMessage?.match(/Column '(.+?)'/);

  return {
    type: MYSQL_ERROR_MAP[error.errno] || DatabaseErrorType.UNKNOWN,
    constraint: constraintMatch?.[1],
    column: columnMatch?.[1],
    detail: error.sqlMessage,
    originalError: error,
  };
}

function parseSQLiteError(error: any): ParsedDatabaseError {
  const message = error.message?.toLowerCase() || "";

  let type = DatabaseErrorType.UNKNOWN;
  if (message.includes("unique")) {
    type = DatabaseErrorType.UNIQUE_VIOLATION;
  } else if (message.includes("foreign key")) {
    type = DatabaseErrorType.FOREIGN_KEY_VIOLATION;
  } else if (message.includes("not null")) {
    type = DatabaseErrorType.NOT_NULL_VIOLATION;
  } else if (message.includes("check constraint")) {
    type = DatabaseErrorType.CHECK_VIOLATION;
  } else if (message.includes("too long")) {
    type = DatabaseErrorType.STRING_TOO_LONG;
  }

  return {
    type,
    detail: error.message,
    originalError: error,
  };
}

export function parseDatabaseError(error: any): ParsedDatabaseError {
  if (isPostgresError(error)) {
    return parsePostgresError(error);
  }

  if (isMySQLError(error)) {
    return parseMySQLError(error);
  }

  if (isSQLiteError(error)) {
    return parseSQLiteError(error);
  }

  return {
    type: DatabaseErrorType.UNKNOWN,
    originalError: error,
  };
}

export function isUniqueViolation(error: any): boolean {
  return parseDatabaseError(error).type === DatabaseErrorType.UNIQUE_VIOLATION;
}

export function isForeignKeyViolation(error: any): boolean {
  return (
    parseDatabaseError(error).type === DatabaseErrorType.FOREIGN_KEY_VIOLATION
  );
}

export function isNotNullViolation(error: any): boolean {
  return (
    parseDatabaseError(error).type === DatabaseErrorType.NOT_NULL_VIOLATION
  );
}

export function getViolatedConstraint(error: any): string | undefined {
  return parseDatabaseError(error).constraint;
}
