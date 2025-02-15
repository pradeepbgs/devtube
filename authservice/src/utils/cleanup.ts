import fs from 'fs'

export const CleanUpResource = (file1: string, file2: string) => {
    if (file1) {
        try { fs.unlinkSync(file1); console.log(`🗑 Deleted local file: ${file1}`); }
        catch (err: any) { console.error("❌ Error deleting avatar:", err.message); }
    }
    if (file2) {
        try { fs.unlinkSync(file2); console.log(`🗑 Deleted local file: ${file2}`); }
        catch (err: any) { console.error("❌ Error deleting cover image:", err.message); }
    }
}