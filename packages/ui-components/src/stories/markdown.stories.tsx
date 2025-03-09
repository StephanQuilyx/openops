import { expect } from '@storybook/jest';
import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Markdown } from '../components';
import { selectLightOrDarkCanvas } from '../test-utils/select-themed-canvas.util';

const queryClient = new QueryClient();

/* Renders a markdown component with support for variables and language text. */
const meta = {
  title: 'components/Markdown',
  component: Markdown,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
} satisfies Meta<typeof Markdown>;

export default meta;

type Story = StoryObj<typeof Markdown>;

/**
 * Shows almost all markdown features, except for code blocks with variables.
 */
export const Miscellaneous: Story = {
  args: {
    markdown: `
# Lorem Ipsum
## Dolor Sit Amet
### Consectetur Adipiscing

Lorem ipsum dolor sit amet, consectetur adipiscing elit.

- Unordered list item 1
- Unordered list item 2
- Unordered list item 3

1. Ordered list item 1
2. Ordered list item 2
3. Ordered list item 3

[Visit OpenOps](https://www.openops.com)

> This is a blockquote with lorem ipsum text.
`,
  },
};

/**
 * Shows almost all markdown features, except for code blocks with variables.
 */
export const WorkflowDocs: Story = {
  args: {
    markdown: `
# Bulk Idle EBS Cleanup

## Overview

This document describes an automated process for identifying and cleaning up idle Amazon Elastic Block Store (EBS) volumes to optimize cloud costs and improve resource utilization as part of FinOps best practices.

## Problem Statement

Idle EBS volumes accumulate over time due to unused or detached instances, leading to unnecessary cloud spend. Manual identification and deletion of these volumes is time-consuming and error-prone.

## Solution

Automate the detection and removal of idle EBS volumes using AWS services and scripts. The automation will:
- Identify unused EBS volumes based on specific criteria (e.g., detached for more than X days, no recent I/O activity).
- Tag volumes for review before deletion.
- Optionally, create snapshots for backup before deletion.
- Delete the identified idle EBS volumes.

## Prerequisites
- AWS CLI configured with appropriate permissions.
- Configured Workflow Automation
- Amazon CloudWatch for monitoring and alerting.
- AWS Identity and Access Management (IAM) roles with permissions to list, tag, snapshot, and delete EBS volumes.

## Implementation Steps

### 1. Identify Idle EBS Volumes
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum

### 2. Tag Volumes for Review
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

### 3. Create Snapshots (Optional)
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

\`\`\`text
aws ec2 create-snapshot --volume-id vol-1234567890 --description "Backup before EBS cleanup
\`\`\`

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
`,
  },
};

/**
 * Emphasizes the use of code blocks with variables.
 * Various code language and code value combinations are shown.
 */
export const CodeBlocks: Story = {
  args: {
    markdown: `
### Code blocks with variables
Language json 👇
\`\`\`json
  {{json}}
\`\`\`
Language text 👇
\`\`\`text
{{nonUrl}}
\`\`\`
Language URL, invalid URL 👇
\`\`\`url
{{nonUrl}}
\`\`\`
Language URL, valid URL 👇
\`\`\`url
{{url}}
\`\`\``,
    variables: {
      nonUrl: 'This code is a non an URL and is NOT clickable',
      url: 'https://some.clickable.url',
      json: '{"key": "value"}',
    },
  },
  play: async ({ canvasElement }) => {
    const links = selectLightOrDarkCanvas(canvasElement).getAllByRole('link');
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute('href', 'https://some.clickable.url');
    expect(links[0]).toHaveAttribute('target', '_blank');
  },
};
