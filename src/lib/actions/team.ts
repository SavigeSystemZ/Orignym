"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";

export async function createOrganizationAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  if (!name) throw new Error("Name required");

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) throw new Error("User not found");

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + randomBytes(4).toString('hex');

  await prisma.organization.create({
    data: {
      name,
      slug,
      members: {
        create: {
          user_id: user.id,
          role: 'OWNER'
        }
      },
      subscription: {
        create: {
          plan_tier: 'free'
        }
      }
    }
  });

  revalidatePath("/team");
}

export async function generateApiKeyAction(organizationId: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  if (!name) throw new Error("Key name required");

  // Validate user is owner/admin of org
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  const membership = await prisma.organizationMember.findUnique({
    where: { organization_id_user_id: { organization_id: organizationId, user_id: user!.id } }
  });

  if (!membership || membership.role !== 'OWNER') {
    throw new Error("Unauthorized to generate API keys for this org");
  }

  const key = 'sk_live_' + randomBytes(32).toString('hex');

  await prisma.apiKey.create({
    data: {
      name,
      key,
      organization_id: organizationId
    }
  });

  revalidatePath("/developers");
}
