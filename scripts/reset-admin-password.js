const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function resetAdminPassword() {
  try {
    console.log('🔐 Resetting Admin Password...\n')

    const adminEmail = 'alexszabo89@icloud.com'
    const newPassword = 'Sofia2022@@'

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    
    console.log('📧 Admin Email:', adminEmail)
    console.log('🔑 New Password:', newPassword)
    console.log('🔒 Hashed Password:', hashedPassword.substring(0, 20) + '...')
    console.log('')

    // Update the admin user's password
    const updatedUser = await prisma.user.update({
      where: { email: adminEmail },
      data: { 
        password: hashedPassword,
        isProfileComplete: true
      }
    })

    console.log('✅ Admin password updated successfully!')
    console.log('👤 User ID:', updatedUser.id)
    console.log('📧 Email:', updatedUser.email)
    console.log('✅ Profile Complete:', updatedUser.isProfileComplete)
    console.log('')

    console.log('🚀 Test Login:')
    console.log('1. Go to: http://localhost:3000/api/auth/signout')
    console.log('2. Go to: http://localhost:3000/auth/signin')
    console.log('3. Email: alexszabo89@icloud.com')
    console.log('4. Password: Sofia2022@@')
    console.log('5. Click "Sign In"')
    console.log('6. Visit: http://localhost:3000/admin')
    console.log('')

    console.log('📊 Expected Results:')
    console.log('- ✅ Login should work without "Invalid password" error')
    console.log('- ✅ Admin dashboard should load with all data')
    console.log('- ✅ No more 401 errors in console')

  } catch (error) {
    console.error('❌ Error resetting admin password:', error)
  } finally {
    await prisma.$disconnect()
  }
}

resetAdminPassword()
