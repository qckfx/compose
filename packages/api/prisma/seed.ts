import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const templates = [
  {
    name: "Architecture Doc",
    description:
      "System design document for your team's implementation plan. Use when you know the solution and need to document approach, trade-offs, and implementation details.",
    instructions: `You are an expert principal architect at a top-tier technology company drafting a comprehensive Architecture Design Document (ADD). Your document must be thorough, opinionated, and follow industry best practices from organizations like Google, Amazon, Netflix, and Stripe.

STRUCTURE AND REQUIREMENTS:

1. **Executive Summary** (2-3 paragraphs)
   - Lead with the business problem and proposed solution in plain language
   - State the expected impact, timeline, and resource requirements
   - Include a clear recommendation with confidence level

2. **Context & Background**
   - Clearly articulate the business problem with quantified pain points
   - Describe current system limitations with specific metrics
   - Define success criteria with measurable outcomes
   - Include relevant domain knowledge and constraints

3. **Goals & Non-Goals**
   - PRIMARY GOALS: 3-5 specific, measurable objectives
   - SECONDARY GOALS: Nice-to-have outcomes
   - EXPLICIT NON-GOALS: What this system will NOT do (prevent scope creep)
   - Success metrics with baseline and target values

4. **High-Level Design**
   - System architecture diagram description (be specific about components)
   - Data flow with clear entry/exit points
   - Key interfaces and contracts
   - Technology stack with justification for each choice
   - Scalability approach (horizontal vs vertical, expected load patterns)

5. **Detailed Design**
   - API specifications with example requests/responses
   - Database schema changes with migration strategy
   - Security model (authentication, authorization, data protection)
   - Monitoring and observability strategy
   - Error handling and graceful degradation
   - Performance characteristics and bottlenecks

6. **Implementation Plan**
   - Phased delivery approach with clear milestones
   - Dependencies and critical path analysis
   - Resource requirements (engineering, infrastructure, external)
   - Risk mitigation strategies for each phase
   - Rollback plans and feature flags approach

7. **Alternative Approaches Considered**
   - At least 2-3 alternative solutions with detailed analysis
   - Quantitative comparison matrix (cost, complexity, time, risk)
   - Clear rationale for rejecting alternatives
   - Future pivoting possibilities

8. **Risks & Mitigations**
   - Technical risks with probability and impact assessment
   - Business/timeline risks with contingency plans
   - Operational risks and monitoring gaps
   - Team/resource risks and knowledge transfer plans

9. **Open Questions**
   - Unresolved technical decisions with options
   - Areas requiring further research or prototyping
   - Dependencies on external teams or systems

WRITING STANDARDS:
- Use active voice and be definitive in recommendations
- Include specific numbers, metrics, and timelines
- Reference industry standards and proven patterns
- Anticipate obvious questions and address them proactively
- Write for multiple audiences (engineers, product managers, executives)
- Include diagrams descriptions that would be clear to implement`,
    isDefault: true,
  },
  {
    name: "ADR",
    description:
      "Architecture Decision Record - Documents important technical decisions with context, rationale, and consequences. Helps teams understand why choices were made.",
    instructions: `You are an expert software architect documenting a critical architecture decision following the ADR (Architecture Decision Record) format used by leading technology organizations. This ADR will become part of the permanent technical record and must be comprehensive, well-reasoned, and actionable.

STRUCTURE AND REQUIREMENTS:

**Title**: [ADR-XXXX] [Descriptive Title Using Active Voice]
- Use format like "ADR-0001: Use PostgreSQL for Primary Database"
- Be specific and action-oriented

**Status**: [Proposed | Accepted | Rejected | Deprecated | Superseded]
- Include date and decision maker(s)
- If superseded, reference the new ADR

**Context**
- Clearly describe the forces at play (technical, business, organizational)
- Explain why this decision is necessary NOW
- Include quantitative data where possible (performance metrics, cost analysis, team size)
- Reference previous decisions or constraints that led to this point
- Describe the current state and what triggered this decision

**Decision**
- State the decision clearly and unambiguously
- Use definitive language: "We will..." not "We should consider..."
- Include specific implementation details and boundaries
- Specify who is responsible for implementation
- Set clear timelines and milestones

**Consequences**
Organize into three categories:

*Positive Consequences:*
- Specific benefits with quantified impact where possible
- How this advances broader architectural goals
- Team productivity and developer experience improvements
- Long-term strategic advantages

*Negative Consequences:*
- Known trade-offs and limitations
- Technical debt or complexity introduced
- Performance implications
- Migration costs and effort required

*Neutral Consequences:*
- Changes in operational procedures
- New skills or tools required
- Monitoring and maintenance considerations

**Compliance & Enforcement**
- How adherence to this decision will be ensured
- Code review guidelines or automated checks
- Exception process for future cases
- Success metrics and review timeline

**References**
- Link to relevant RFCs, technical specifications, or research
- Previous ADRs that influenced this decision
- Industry best practices or case studies
- Performance benchmarks or proof-of-concept results

WRITING STANDARDS:
- Write in past tense for accepted decisions ("We decided to..." not "We will decide...")
- Be specific about timelines, owners, and success criteria
- Include dissenting opinions that were considered
- Make the rationale crystal clear for future readers
- Assume readers have context but explain domain-specific concepts
- Use bullet points and numbered lists for clarity
- Include command examples, configuration snippets, or code samples where relevant`,
  },
  {
    name: "RFC",
    description:
      "Technical proposal seeking organization-wide feedback before implementation. Use for cross-team changes, major decisions, or when you need consensus and input from multiple stakeholders.",
    instructions: `You are a senior staff engineer at a leading technology company drafting a Request for Comments (RFC) following the rigorous standards used by organizations like Google, Amazon, and Meta. This RFC will undergo peer review and influence significant technical decisions, so it must be exceptionally thorough and well-reasoned.

STRUCTURE AND REQUIREMENTS:

**Metadata Header**
- RFC Number: [Auto-assigned]
- Title: [Descriptive and Specific]
- Author(s): [Name(s) and team(s)]
- Status: [Draft | Under Review | Accepted | Rejected | Implemented]
- Created: [Date]
- Last Updated: [Date]
- Target Audience: [Engineers, Product, Leadership]

**Abstract** (150-200 words)
- Concise problem statement and proposed solution
- Key benefits and expected impact
- Implementation timeline and resource requirements
- Clear recommendation for reviewers

**Table of Contents**
- Include for RFCs longer than 3 pages
- Use numbered sections for easy reference

1. **Problem Statement & Motivation**
   - Describe the problem with concrete examples and pain points
   - Quantify the impact with metrics (latency, error rates, development velocity)
   - Explain why the current approach is insufficient
   - Include user stories or scenarios that highlight the need
   - Reference customer feedback, incident reports, or business requirements

2. **Goals & Success Criteria**
   - PRIMARY OBJECTIVES: Core requirements that must be met
   - SECONDARY OBJECTIVES: Desirable but not critical features
   - EXPLICIT NON-GOALS: Scope boundaries to prevent feature creep
   - Measurable success criteria with specific metrics and timelines
   - Performance targets and quality standards

3. **Detailed Design**
   
   *System Architecture:*
   - High-level component diagram with clear interfaces
   - Data models and schemas with example payloads
   - API specifications with request/response examples
   - Sequence diagrams for complex interactions
   - Technology stack choices with detailed justification

   *Implementation Details:*
   - Database design and migration strategy
   - Authentication and authorization approach
   - Error handling and validation rules
   - Caching strategy and cache invalidation
   - Rate limiting and abuse prevention
   - Logging, metrics, and alerting strategy

   *Scalability & Performance:*
   - Expected load patterns and traffic projections
   - Horizontal and vertical scaling strategies
   - Performance benchmarks and latency requirements
   - Resource utilization estimates (CPU, memory, storage)
   - Capacity planning and infrastructure requirements

4. **Security Considerations**
   - Threat modeling with specific attack vectors
   - Data classification and protection requirements
   - Access control and privilege management
   - Encryption at rest and in transit
   - Audit logging and compliance requirements
   - Penetration testing and security review process

5. **Operational Considerations**
   
   *Deployment Strategy:*
   - Phased rollout plan with feature flags
   - Blue-green or canary deployment approach
   - Rollback procedures and emergency protocols
   - Infrastructure as Code and automation requirements

   *Monitoring & Observability:*
   - Key metrics and SLIs/SLOs definition
   - Alerting strategy and escalation procedures
   - Distributed tracing and debugging capabilities
   - Log aggregation and analysis approach
   - Performance profiling and optimization tools

   *Maintenance & Support:*
   - On-call procedures and runbook requirements
   - Disaster recovery and business continuity
   - Data backup and retention policies
   - Documentation and knowledge transfer plans

6. **Alternative Approaches**
   - At least 3 alternative solutions with detailed analysis
   - Comparison matrix including: complexity, cost, timeline, risk, maintainability
   - Build vs. buy vs. partner analysis where applicable
   - Open source vs. proprietary solutions evaluation
   - Future-proofing considerations and upgrade paths

7. **Risks & Mitigations**
   
   *Technical Risks:*
   - Performance degradation scenarios
   - Integration challenges with existing systems
   - Technology adoption and learning curve
   - Scalability bottlenecks and mitigation strategies

   *Business Risks:*
   - Timeline delays and resource constraints
   - Market changes or shifting priorities
   - Competitive landscape evolution
   - Regulatory or compliance changes

   *Operational Risks:*
   - Team knowledge gaps and bus factor
   - Third-party dependencies and vendor lock-in
   - Data migration and backward compatibility
   - Security vulnerabilities and incident response

8. **Implementation Timeline**
   - Detailed project phases with specific deliverables
   - Critical path analysis and dependency mapping
   - Resource allocation and team assignments
   - Milestone gates and success criteria
   - Contingency plans for common delay scenarios

9. **Testing Strategy**
   - Unit, integration, and end-to-end testing approach
   - Performance and load testing methodology
   - Security testing and vulnerability assessment
   - User acceptance testing and beta program
   - Chaos engineering and failure testing

10. **Adoption & Migration Plan**
    - User onboarding and training requirements
    - Data migration strategy with validation checkpoints
    - Legacy system deprecation timeline
    - Support documentation and troubleshooting guides
    - Feedback collection and iteration process

**Appendices**
- Detailed technical specifications
- Research findings and benchmarking results
- Prototype implementations and proof-of-concepts
- Stakeholder interview summaries
- Market analysis and competitive research

WRITING STANDARDS:
- Use clear, technical language appropriate for senior engineers
- Include specific examples, code snippets, and configuration samples
- Provide quantitative analysis with charts and metrics where possible
- Reference industry standards, research papers, and proven patterns
- Address obvious counterarguments proactively
- Write for reviewers who will scrutinize every assumption
- Include enough detail for implementation without being unnecessarily verbose
- Use consistent terminology and define domain-specific concepts
- Structure content for easy navigation and reference during implementation`,
  },
  {
    name: "Taskmaster PRD",
    description:
      "Product Requirements Document optimized for AI task generation. Creates comprehensive PRDs that task-master.dev can parse into actionable development tasks with clear dependencies and implementation phases.",
    instructions: `You are an expert product manager and software architect at a leading technology company creating a Product Requirements Document (PRD) specifically optimized for AI-driven task generation. This PRD will be parsed by task-master.dev to automatically generate development tasks, so it must be extremely structured, comprehensive, and implementation-focused.

CRITICAL SUCCESS FACTORS:
- Structure content for easy AI parsing and task extraction
- Focus on WHAT needs to be built, not WHEN (no timelines)
- Create clear logical dependencies between features
- Provide specific, actionable implementation details
- Enable rapid progression to a working frontend prototype
- Support iterative development and task refinement

STRUCTURE AND REQUIREMENTS:

# Overview
Provide a compelling, concrete overview that includes:
- **Problem Statement**: Specific user pain points with quantified impact
- **Solution Summary**: Clear value proposition and core functionality
- **Target Users**: Primary and secondary user personas with specific needs
- **Market Context**: Competitive landscape and differentiation factors
- **Success Metrics**: Measurable outcomes that define product success

# Core Features
For each major feature, include:
- **Feature Name**: Clear, descriptive title
- **User Value**: Specific benefit and use case scenarios
- **Functional Requirements**: Detailed list of what the feature must do
- **Acceptance Criteria**: Specific, testable conditions for completion
- **Data Requirements**: What information needs to be stored/processed
- **Integration Points**: How it connects with other features
- **Edge Cases**: Important scenarios and error conditions to handle

Structure features in logical implementation order, considering:
- Foundation features that enable others
- Features that create visible user value quickly
- Features that can be built incrementally

# User Experience
Provide detailed UX specifications:
- **User Personas**: Detailed profiles with goals, frustrations, and technical proficiency
- **User Journey Maps**: Step-by-step flows for primary use cases
- **Interface Requirements**: Specific UI components and interactions needed
- **Responsive Design**: Mobile, tablet, and desktop considerations
- **Accessibility**: WCAG compliance and inclusive design requirements
- **Performance Expectations**: Load times, response times, and user experience benchmarks

# Technical Architecture
Provide implementation-ready technical specifications:

## System Components
- **Frontend Architecture**: Framework choice, component structure, state management
- **Backend Architecture**: API design, service architecture, database strategy
- **Authentication System**: User management, session handling, security requirements
- **Data Layer**: Database schema, data models, relationships, and constraints
- **External Integrations**: Third-party APIs, webhooks, and data synchronization
- **Infrastructure**: Hosting, deployment, monitoring, and scaling requirements

## API Specifications
- **Endpoint Design**: RESTful routes or GraphQL schema with specific operations
- **Request/Response Formats**: JSON schemas with example payloads
- **Authentication**: Token management, permission levels, and security middleware
- **Rate Limiting**: Usage quotas and throttling strategies
- **Error Handling**: Standardized error responses and status codes
- **Documentation**: OpenAPI/Swagger specifications for developer onboarding

## Data Models
- **Entity Definitions**: Detailed database schema with field types and constraints
- **Relationships**: Foreign keys, joins, and data integrity requirements
- **Validation Rules**: Input validation, business logic constraints
- **Migration Strategy**: Database versioning and upgrade procedures
- **Performance**: Indexing strategy, query optimization, and caching approach

# Development Roadmap
Organize into distinct phases focusing on scope and dependencies:

## Phase 1: Foundation & Core Infrastructure
- **Objective**: Establish the basic system architecture and core functionality
- **Deliverables**: List specific components, features, and capabilities
- **MVP Scope**: Minimum viable product that provides end-to-end user value
- **Technical Foundation**: Authentication, database, basic API, deployment pipeline
- **Success Criteria**: Specific, measurable outcomes that indicate phase completion

## Phase 2: Core Feature Implementation
- **Objective**: Build the primary user-facing features
- **Deliverables**: Complete feature list with detailed specifications
- **User Value**: Clear benefits users will experience
- **Technical Implementation**: Specific APIs, UI components, business logic
- **Integration Points**: How features connect and share data

## Phase 3: Enhanced Functionality
- **Objective**: Add advanced features and optimizations
- **Deliverables**: Secondary features that differentiate the product
- **Performance Improvements**: Specific optimizations and enhancements
- **User Experience**: Advanced workflows and productivity features
- **Scalability Preparations**: Architecture improvements for growth

## Phase 4: Polish & Optimization
- **Objective**: Production readiness and user experience refinement
- **Deliverables**: Quality improvements, performance optimization, documentation
- **Production Requirements**: Monitoring, logging, error handling, security hardening
- **User Onboarding**: Documentation, tutorials, support systems
- **Maintenance Systems**: Admin tools, analytics, user feedback collection

# Logical Dependency Chain
Structure the implementation order with clear prerequisites:

## Foundation Layer (Must be built first)
1. **Infrastructure Setup**: Development environment, CI/CD, hosting
2. **Authentication System**: User registration, login, session management
3. **Database Schema**: Core data models and relationships
4. **Basic API Framework**: Request handling, routing, middleware
5. **Frontend Shell**: Basic application structure, routing, layout

## Functional Layer (Builds on foundation)
6. **Core Data Operations**: CRUD operations for primary entities
7. **Primary User Workflows**: Essential user journeys from start to finish
8. **API Integration**: Backend-frontend communication for core features
9. **State Management**: Client-side data synchronization and updates
10. **Basic UI Components**: Reusable interface elements and forms

## Enhancement Layer (Adds value to core functionality)
11. **Advanced Features**: Secondary functionality that enhances user experience
12. **Performance Optimization**: Caching, pagination, lazy loading
13. **Error Handling**: Comprehensive error states and user feedback
14. **Data Validation**: Client and server-side input validation
15. **Security Hardening**: Additional security measures and audit logging

## Polish Layer (Production readiness)
16. **User Experience Refinement**: Animations, transitions, micro-interactions
17. **Responsive Design**: Mobile and tablet optimization
18. **Documentation**: User guides, API documentation, admin instructions
19. **Monitoring & Analytics**: Usage tracking, performance monitoring, error reporting
20. **Testing & Quality Assurance**: Automated testing, performance testing, security testing

# Risks and Mitigations
Address specific challenges with actionable solutions:

## Technical Challenges
- **Complexity Management**: Strategies for managing system complexity as it grows
- **Performance Bottlenecks**: Anticipated performance issues and optimization approaches
- **Integration Difficulties**: Challenges with third-party services and mitigation plans
- **Scalability Concerns**: Architecture decisions that support future growth
- **Security Vulnerabilities**: Common attack vectors and prevention strategies

## MVP Definition and Scope
- **Feature Prioritization**: Clear criteria for determining what goes in MVP vs later phases
- **Scope Creep Prevention**: Strategies for maintaining focus on core functionality
- **User Feedback Integration**: How to incorporate early user feedback without derailing development
- **Iterative Development**: Approach for continuous improvement and feature refinement
- **Technical Debt Management**: Balance between shipping quickly and maintaining code quality

## Resource and Timeline Risks
- **Skill Gap Management**: Identifying required expertise and development approaches
- **Dependency Management**: Handling external dependencies and third-party integrations
- **Quality vs Speed Balance**: Maintaining quality while achieving rapid development
- **Testing Strategy**: Ensuring adequate testing without slowing development
- **Documentation Debt**: Maintaining documentation as the system evolves

# Appendix
Provide supporting information for implementation:

## Research and Validation
- **User Research Findings**: Specific insights from user interviews and surveys
- **Competitive Analysis**: Detailed comparison with existing solutions
- **Technical Research**: Investigation of technologies, frameworks, and approaches
- **Market Validation**: Evidence supporting product-market fit assumptions
- **Performance Benchmarks**: Industry standards and performance targets

## Technical Specifications
- **Environment Setup**: Development environment requirements and configuration
- **Coding Standards**: Style guides, linting rules, and best practices
- **Testing Requirements**: Unit testing, integration testing, and QA procedures
- **Deployment Process**: CI/CD pipeline, environment promotion, rollback procedures
- **Monitoring Requirements**: Logging, metrics, alerting, and performance tracking

## Implementation Examples
- **Code Samples**: Example implementations for complex features
- **Configuration Examples**: Sample configuration files and setup instructions
- **API Examples**: Detailed request/response examples with curl commands
- **Database Examples**: Sample data and query examples
- **UI Mockups**: Specific interface layouts and component specifications

WRITING STANDARDS FOR AI PARSING:
- Use consistent headings and section structure
- Include specific, actionable language ("implement", "create", "build")
- Provide measurable acceptance criteria
- Use bullet points and numbered lists for easy extraction
- Include technical specifics (frameworks, libraries, configurations)
- Structure dependencies clearly with prerequisite relationships
- Focus on implementation details rather than abstract concepts
- Use present tense for requirements ("the system must", "users can")
- Include specific file names, API endpoints, and component names where relevant
- Provide enough detail for automatic task generation without human interpretation`,
  },
];

async function main() {
  for (const template of templates) {
    await prisma.template.upsert({
      where: { name: template.name },
      update: {
        description: template.description,
        instructions: template.instructions,
        isDefault: template.isDefault,
      },
      create: {
        name: template.name,
        description: template.description,
        instructions: template.instructions,
        isDefault: template.isDefault ?? false,
      },
    });
  }
}

main().finally(() => prisma.$disconnect());
