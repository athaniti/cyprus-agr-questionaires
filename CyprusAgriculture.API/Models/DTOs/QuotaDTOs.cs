namespace CyprusAgriculture.API.Models.DTOs
{
    /// <summary>
    /// DTO for creating a new quota
    /// </summary>
    public class CreateQuotaRequest
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public Guid QuestionnaireId { get; set; }
        public QuotaCriteriaDto Criteria { get; set; } = new();
        public int TargetCount { get; set; }
        public bool IsActive { get; set; } = true;
        public bool AutoStop { get; set; } = true;
        public int Priority { get; set; } = 0;
        public string CreatedBy { get; set; } = string.Empty;
    }

    /// <summary>
    /// DTO for updating an existing quota
    /// </summary>
    public class UpdateQuotaRequest
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public QuotaCriteriaDto? Criteria { get; set; }
        public int? TargetCount { get; set; }
        public bool? IsActive { get; set; }
        public bool? AutoStop { get; set; }
        public int? Priority { get; set; }
        public string? UpdatedBy { get; set; }
    }

    /// <summary>
    /// DTO for quota response
    /// </summary>
    public class QuotaDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public Guid QuestionnaireId { get; set; }
        public string QuestionnaireName { get; set; } = string.Empty;
        public QuotaCriteriaDto Criteria { get; set; } = new();
        public int TargetCount { get; set; }
        public int CompletedCount { get; set; }
        public int InProgressCount { get; set; }
        public int PendingCount { get; set; }
        public int RemainingCount { get; set; }
        public decimal CompletionPercentage { get; set; }
        public string Status { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public bool AutoStop { get; set; }
        public int Priority { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public string? UpdatedBy { get; set; }
    }

    /// <summary>
    /// DTO for quota criteria (combination of variables)
    /// </summary>
    public class QuotaCriteriaDto
    {
        public List<QuotaCriterionDto> Criteria { get; set; } = new();
        public string Logic { get; set; } = "AND"; // AND/OR logic between criteria
    }

    /// <summary>
    /// DTO for individual quota criterion
    /// </summary>
    public class QuotaCriterionDto
    {
        public string VariableName { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public string Operator { get; set; } = "equals"; // equals, in, between, contains, etc.
        public List<string> Values { get; set; } = new();
        public string VariableType { get; set; } = string.Empty;
    }

    /// <summary>
    /// DTO for quota monitoring dashboard
    /// </summary>
    public class QuotaMonitoringDto
    {
        public Guid QuestionnaireId { get; set; }
        public string QuestionnaireName { get; set; } = string.Empty;
        public List<QuotaStatusDto> Quotas { get; set; } = new();
        public QuotaSummaryDto Summary { get; set; } = new();
        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
    }

    /// <summary>
    /// DTO for individual quota status in monitoring
    /// </summary>
    public class QuotaStatusDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public QuotaCriteriaDto Criteria { get; set; } = new();
        public int TargetCount { get; set; }
        public int CompletedCount { get; set; }
        public int InProgressCount { get; set; }
        public int PendingCount { get; set; }
        public int RemainingCount { get; set; }
        public decimal CompletionPercentage { get; set; }
        public string Status { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public int Priority { get; set; }
        
        // Additional monitoring fields
        public int TodayCompletions { get; set; }
        public int WeekCompletions { get; set; }
        public decimal DailyRate { get; set; }
        public DateTime? EstimatedCompletion { get; set; }
    }

    /// <summary>
    /// DTO for quota summary statistics
    /// </summary>
    public class QuotaSummaryDto
    {
        public int TotalQuotas { get; set; }
        public int ActiveQuotas { get; set; }
        public int CompletedQuotas { get; set; }
        public int TotalTargetCount { get; set; }
        public int TotalCompletedCount { get; set; }
        public int TotalInProgressCount { get; set; }
        public int TotalPendingCount { get; set; }
        public int TotalRemainingCount { get; set; }
        public decimal OverallCompletionPercentage { get; set; }
        public int TodayCompletions { get; set; }
        public int WeekCompletions { get; set; }
        public decimal AverageDailyRate { get; set; }
    }

    /// <summary>
    /// DTO for quota variable definition
    /// </summary>
    public class QuotaVariableDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string VariableType { get; set; } = string.Empty;
        public string DataType { get; set; } = string.Empty;
        public List<QuotaVariableValueDto> PossibleValues { get; set; } = new();
        public bool IsActive { get; set; }
        public int SortOrder { get; set; }
    }

    /// <summary>
    /// DTO for quota variable possible values
    /// </summary>
    public class QuotaVariableValueDto
    {
        public string Value { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
    }

    /// <summary>
    /// DTO for creating/updating quota variables
    /// </summary>
    public class CreateQuotaVariableRequest
    {
        public string Name { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string VariableType { get; set; } = string.Empty;
        public string DataType { get; set; } = "Select";
        public List<QuotaVariableValueDto> PossibleValues { get; set; } = new();
        public bool IsActive { get; set; } = true;
        public int SortOrder { get; set; } = 0;
    }

    /// <summary>
    /// DTO for quota allocation result
    /// </summary>
    public class QuotaAllocationResult
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public Guid? AllocatedQuotaId { get; set; }
        public string? AllocatedQuotaName { get; set; }
        public bool QuotaFull { get; set; }
        public List<Guid> EligibleQuotaIds { get; set; } = new();
        public Dictionary<string, object> ResponseCriteria { get; set; } = new();
    }

    /// <summary>
    /// DTO for real-time quota updates
    /// </summary>
    public class QuotaUpdateNotification
    {
        public Guid QuotaId { get; set; }
        public string QuotaName { get; set; } = string.Empty;
        public Guid QuestionnaireId { get; set; }
        public string UpdateType { get; set; } = string.Empty; // "response_added", "response_completed", "target_updated", etc.
        public int PreviousCompletedCount { get; set; }
        public int NewCompletedCount { get; set; }
        public int TargetCount { get; set; }
        public decimal CompletionPercentage { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public Dictionary<string, object> AdditionalData { get; set; } = new();
    }
}