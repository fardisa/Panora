import { PipedriveContactInput, PipedriveContactOutput } from 'src/crm/@types';
import {
  UnifiedContactInput,
  UnifiedContactOutput,
} from '@contact/types/model.unified';

export function convertUnifiedContactToPipedrive(
  source: UnifiedContactInput,
  customFieldMappings?: {
    slug: string;
    remote_id: string;
  }[],
): PipedriveContactInput {
  // Assuming 'email_addresses' and 'phone_numbers' arrays contain at least one entry
  const primaryEmail = source.email_addresses?.[0]?.email_address;
  const primaryPhone = source.phone_numbers?.[0]?.phone_number;

  const emailObject = primaryEmail
    ? [{ value: primaryEmail, primary: true, label: '' }]
    : [];
  const phoneObject = primaryPhone
    ? [{ value: primaryPhone, primary: true, label: '' }]
    : [];
  const result: PipedriveContactInput = {
    name: `${source.first_name} ${source.last_name}`,
    email: emailObject,
    phone: phoneObject,
  };

  if (customFieldMappings && source.field_mappings) {
    for (const fieldMapping of source.field_mappings) {
      for (const key in fieldMapping) {
        const mapping = customFieldMappings.find(
          (mapping) => mapping.slug === key,
        );
        if (mapping) {
          result[mapping.remote_id] = fieldMapping[key];
        }
      }
    }
  }
  return result;
}

export function convertPipedriveContactToUnified(
  source: PipedriveContactOutput | PipedriveContactOutput[],
  customFieldMappings?: {
    slug: string;
    remote_id: string;
  }[],
): UnifiedContactOutput | UnifiedContactOutput[] {
  if (!Array.isArray(source)) {
    return mapSinglePipedriveContactToUnified(source, customFieldMappings);
  }

  // Handling array of HubspotContactOutput
  return source.map((contact) =>
    mapSinglePipedriveContactToUnified(contact, customFieldMappings),
  );
}

function mapSinglePipedriveContactToUnified(
  contact: PipedriveContactOutput,
  customFieldMappings?: {
    slug: string;
    remote_id: string;
  }[],
): UnifiedContactOutput {
  const field_mappings = customFieldMappings.map((mapping) => ({
    [mapping.slug]: contact[mapping.remote_id],
  }));
  return {
    first_name: contact.first_name,
    last_name: contact.last_name,
    email_addresses: contact.email.map((e) => ({
      email_address: e.value,
      email_address_type: e.label ? e.label : '',
    })), // Map each email
    phone_numbers: contact.phone.map((p) => ({
      phone_number: p.value,
      phone_type: p.label ? p.label : '',
    })), // Map each phone number,
    field_mappings,
  };
}
